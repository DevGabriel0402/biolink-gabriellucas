import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Uso: node scripts/geocodeAddresses.mjs <arquivo.csv>');
  process.exit(1);
}

const cachePath = resolve('scripts/pratique-geocode-cache-v3.json');
const cache = existsSync(cachePath)
  ? JSON.parse(readFileSync(cachePath, 'utf8'))
  : {};

const legacySource = existsSync(resolve('src/data/pratiqueAddresses.ts'))
  ? readFileSync(resolve('src/data/pratiqueAddresses.ts'), 'utf8')
  : '';

const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && quoted && next === '"') {
      field += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(field.trim());
      field = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(field.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
};

const [, ...csvRows] = parseCsv(readFileSync(resolve(inputPath), 'utf8').replace(/^\uFEFF/, ''));
const gyms = csvRows.map(([rawName, address, postalCode]) => ({
  name: rawName.replace(/^Pratique Fitness\s*-\s*/i, '').replace(/^Pratique\s+/i, 'Pratique '),
  address,
  postalCode,
}));

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

const normalize = (value = '') => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const streetKey = (address) => normalize(address.split(' - ')[0]);
const legacyEntries = [...legacySource.matchAll(/address:\s*"([^"]+)"[^\n]*?lat:\s*(-?\d+(?:\.\d+)?),\s*lng:\s*(-?\d+(?:\.\d+)?)/g)]
  .map((match) => ({
    street: streetKey(match[1]),
    lat: Number(match[2]),
    lng: Number(match[3]),
  }));
const legacyByStreet = new Map(legacyEntries.map(({ street, lat, lng }) => [street, { lat, lng }]));

const findLegacyLocation = (address) => {
  const parts = address.split(',').map((part) => part.trim());
  const candidateKey = streetKey(parts.slice(0, 2).join(', '));
  const exact = legacyByStreet.get(candidateKey);
  if (exact) return exact;

  const candidateNumber = candidateKey.match(/\b\d+\b/)?.[0];
  const candidateWords = candidateKey.split(' ').filter((word) => word.length >= 4 && !/^\d+$/.test(word));
  const ranked = legacyEntries
    .map((entry) => {
      const entryNumber = entry.street.match(/\b\d+\b/)?.[0];
      if (candidateNumber && entryNumber && candidateNumber !== entryNumber) return { entry, score: -1 };
      const score = candidateWords.filter((word) => entry.street.includes(word)).length;
      return { entry, score };
    })
    .sort((left, right) => right.score - left.score);
  if ((ranked[0]?.score ?? 0) < 2) return null;
  return { lat: ranked[0].entry.lat, lng: ranked[0].entry.lng };
};

const stateNames = {
  MG: 'Minas Gerais',
  SC: 'Santa Catarina',
  PR: 'Paraná',
  ES: 'Espírito Santo',
  FL: 'Florida',
};

const parseAddress = (address) => {
  const parts = address.split(',').map((part) => part.trim());
  const country = parts.at(-1) ?? '';
  const state = parts.at(-2) ?? '';
  const city = parts.at(-3) ?? '';
  const street = parts.slice(0, -3).join(', ');
  return { street, city, state, country };
};

const resultScore = (result, expected) => {
  const details = result.address ?? {};
  const resultState = normalize(details.state ?? details.region ?? '');
  const resultCity = normalize(
    details.city ?? details.town ?? details.municipality ?? details.village ?? details.county ?? ''
  );
  const resultRoad = normalize(details.road ?? details.pedestrian ?? details.suburb ?? '');
  const expectedState = normalize(stateNames[expected.state] ?? expected.state);
  const expectedCity = normalize(expected.city);
  const expectedRoadWords = normalize(expected.street).split(' ').filter((word) => word.length >= 4);
  const matchingRoadWords = expectedRoadWords.filter((word) => resultRoad.includes(word)).length;

  let score = 0;
  if (resultState.includes(expectedState) || expectedState.includes(resultState)) score += 5;
  if (resultCity.includes(expectedCity) || expectedCity.includes(resultCity)) score += 7;
  score += matchingRoadWords * 2;
  if (details.house_number && normalize(expected.street).includes(normalize(details.house_number))) score += 4;
  return score;
};

const searchNominatim = async (params) => {
  const query = new URLSearchParams({
    format: 'jsonv2',
    limit: '5',
    addressdetails: '1',
    ...params,
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${query}`, {
    headers: {
      'User-Agent': 'BioApp-Pratique-Map/1.0 (one-time address import)',
      'Accept-Language': 'pt-BR,pt;q=0.9',
    },
  });
  if (!response.ok) throw new Error(`Nominatim respondeu ${response.status}`);
  return response.json();
};

const geocode = async (gym) => {
  const cacheKey = `${gym.address}|${gym.postalCode}`;
  if (cache[cacheKey]) return cache[cacheKey];

  const expected = parseAddress(gym.address);
  const attempts = expected.street && expected.city
    ? [
        { street: expected.street, city: expected.city, state: stateNames[expected.state] ?? expected.state, country: expected.country, postalcode: gym.postalCode },
        { street: expected.street, city: expected.city, state: stateNames[expected.state] ?? expected.state, country: expected.country },
        { q: gym.address },
        { q: `${gym.address}, ${gym.postalCode}` },
        { q: `${expected.street}, ${stateNames[expected.state] ?? expected.state}, ${expected.country}` },
      ]
    : [{ q: gym.address }, { q: `${gym.address}, ${gym.postalCode}` }];

  let candidates = [];
  for (const params of attempts) {
    candidates = await searchNominatim(params);
    if (candidates.length) break;
    await sleep(1100);
  }
  if (!candidates.length) {
    const legacy = findLegacyLocation(gym.address);
    if (legacy) return legacy;
    throw new Error(`Endereço não encontrado: ${gym.address}`);
  }

  const ranked = candidates
    .map((result) => ({ result, score: resultScore(result, expected) }))
    .sort((left, right) => right.score - left.score);
  const best = ranked[0];
  if (expected.country === 'Brasil' && best.score < 10) {
    const legacy = findLegacyLocation(gym.address);
    if (legacy) return legacy;
    throw new Error(`Resultado incompatível com cidade/estado: ${gym.address}`);
  }

  const location = {
    lat: Number(best.result.lat),
    lng: Number(best.result.lon),
  };
  cache[cacheKey] = location;
  writeFileSync(cachePath, `${JSON.stringify(cache, null, 2)}\n`, 'utf8');
  await sleep(1100);
  return location;
};

const escapeTs = (value) => JSON.stringify(value);
const resolvedGyms = [];

for (let index = 0; index < gyms.length; index += 1) {
  const gym = gyms[index];
  process.stdout.write(`[${index + 1}/${gyms.length}] ${gym.name}... `);
  try {
    const location = await geocode(gym);
    resolvedGyms.push({ ...gym, ...location });
    console.log(`${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
  } catch (error) {
    console.log(`ERRO: ${error.message}`);
    process.exitCode = 1;
    break;
  }
}

if (resolvedGyms.length !== gyms.length) process.exit(1);

const directoryUrl = 'https://pratiquefitness.com.br/unidades-pratique/';
const unitLines = resolvedGyms.map((gym) =>
  `  { name: ${escapeTs(gym.name)}, link: ${escapeTs(directoryUrl)}, address: ${escapeTs(gym.address)}, postalCode: ${escapeTs(gym.postalCode)}, lat: ${gym.lat}, lng: ${gym.lng} },`
);

const unitsSource = `export interface PratiqueUnit {
  name: string;
  link: string;
  address: string;
  postalCode: string;
  lat: number;
  lng: number;
}

/** Lista canônica de academias fornecida pelo proprietário do aplicativo. */
export const PRATIQUE_UNIDADES_LIST: PratiqueUnit[] = [
${unitLines.join('\n')}
];

export const PRATIQUE_UNIDADES: Record<string, string> = Object.fromEntries(
  PRATIQUE_UNIDADES_LIST.map(({ name, link }) => [name, link])
);
`;

const addressLines = resolvedGyms.map((gym) =>
  `  ${escapeTs(gym.name)}: { address: ${escapeTs(gym.address)}, postalCode: ${escapeTs(gym.postalCode)}, lat: ${gym.lat}, lng: ${gym.lng} },`
);

const addressesSource = `export interface UnitLocation {
  address: string;
  postalCode: string;
  lat: number;
  lng: number;
}

/** Coordenadas vinculadas por nome exato; não há correspondência aproximada. */
export const PRATIQUE_ADDRESSES: Record<string, UnitLocation> = {
${addressLines.join('\n')}
};
`;

writeFileSync(resolve('src/data/pratiqueUnits.ts'), unitsSource, 'utf8');
writeFileSync(resolve('src/data/pratiqueAddresses.ts'), addressesSource, 'utf8');
console.log(`\n${resolvedGyms.length} academias atualizadas.`);
