import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const applyChanges = process.argv.includes('--apply');
const limitArgument = process.argv.find((argument) => argument.startsWith('--limit='));
const requestedLimit = limitArgument ? Number(limitArgument.split('=')[1]) : null;
const unitsPath = resolve('src/data/pratiqueUnits.ts');
const addressesPath = resolve('src/data/pratiqueAddresses.ts');
const geocodeCachePath = resolve('scripts/pratique-geocode-cache-v3.json');
const googleCachePath = resolve('scripts/google-maps-cache.json');
const auditPath = resolve('scripts/google-maps-audit.json');

const unitsSource = readFileSync(unitsPath, 'utf8');
const unitPattern = /\{ name: "([^"]+)", link: "([^"]+)", address: "([^"]+)", postalCode: "([^"]+)", lat: (-?\d+(?:\.\d+)?), lng: (-?\d+(?:\.\d+)?) \}/g;
const allUnits = [...unitsSource.matchAll(unitPattern)].map((match) => ({
  name: match[1],
  address: match[3],
  postalCode: match[4],
  lat: Number(match[5]),
  lng: Number(match[6]),
}));

if (allUnits.length !== 154) {
  throw new Error(`Esperadas 154 unidades, mas foram encontradas ${allUnits.length}.`);
}
const units = requestedLimit ? allUnits.slice(0, requestedLimit) : allUnits;

const googleCache = existsSync(googleCachePath)
  ? JSON.parse(readFileSync(googleCachePath, 'utf8'))
  : {};

/** Casos revisados manualmente quando a planilha usa endereço antigo ou município divergente. */
const manualGoogleOverrides = {
  'Santa Inês': {
    lat: -19.8813193,
    lng: -43.9080135,
    title: 'R. Contagem, 1740 - Santa Inês',
    fullAddress: 'R. Contagem, 1740 - Santa Inês, Sabará - MG, 31080-055',
  },
  Eldorado: {
    lat: -19.9342847,
    lng: -44.0529519,
    title: 'Academia Pratique Fitness - Eldorado',
    fullAddress: 'Av. Doutor Cincinato Cajado Braga, 375 - Novo Eldorado, Contagem - MG, 32341-310',
  },
  'Santa Helena': {
    lat: -19.9899165,
    lng: -44.0128732,
    title: 'Academia Pratique Fitness - Santa Helena',
    fullAddress: 'Av. Waldyr Soeiro Emrich, 3350 - Loja 6 - Santa Helena, Belo Horizonte - MG, 30610-530',
  },
  'Santa Luzia 2': {
    lat: -19.8166839,
    lng: -43.8862764,
    title: 'Pratique Fitness - Monte Azul',
    fullAddress: 'Rod. Camilo Teixeira da Costa, 6355 - Monte Azul, Belo Horizonte - MG, 31872-810',
  },
  'Sete Lagoas 2': {
    lat: -19.4695251,
    lng: -44.2435625,
    title: 'R. Cel. Antônio Andrade - São Geraldo',
    fullAddress: 'R. Cel. Antônio Andrade - São Geraldo, Sete Lagoas - MG, 35700-193',
  },
  'Ingleses 3': {
    lat: -27.478393,
    lng: -48.418493,
    title: 'Academia Pratique Fitness - Ingleses Rio Vermelho',
    fullAddress: 'Rua Canto das Gaivotas, s/n - São João do Rio Vermelho, Florianópolis - SC',
  },
  'Porto Belo': {
    lat: -27.155356,
    lng: -48.5908806,
    title: 'Academia UFit Porto Belo - Jardim Dourado',
    fullAddress: 'Av. Colombo Machado Sales, 636 - Jardim Dourado, Porto Belo - SC, 88210-000',
  },
  'Pato Branco 1': {
    lat: -26.214145,
    lng: -52.674431,
    title: 'Academia Pratique Fitness - Pato Branco Paraná',
    fullAddress: 'Av. Tupi, 1005 - Vila Izabel, Pato Branco - PR',
  },
};

const normalize = (value = '') => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const significantWords = (value) => normalize(value)
  .split(' ')
  .filter((word) => word.length >= 4 && !['pratique', 'fitness', 'academia', 'brasil'].includes(word));

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

const haversineKm = (lat1, lng1, lat2, lng2) => {
  const radius = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos((lat1 * Math.PI) / 180)
    * Math.cos((lat2 * Math.PI) / 180)
    * Math.sin(dLng / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const decodeGoogleText = (value) => JSON.parse(`"${value.replace(/"/g, '\\"')}"`);

const parseGoogleEntity = (html) => {
  const match = html.match(/\[\["[^"]+","((?:\\.|[^"\\])*)",\[(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)\](?:,"[^"]*")?\],"((?:\\.|[^"\\])*)"/);
  if (!match) return null;
  return {
    fullAddress: decodeGoogleText(match[1]),
    lat: Number(match[2]),
    lng: Number(match[3]),
    title: decodeGoogleText(match[4]),
  };
};

const validateResult = (unit, result) => {
  const returned = normalize(`${result.title} ${result.fullAddress}`);
  const addressParts = unit.address.split(',').map((part) => part.trim());
  const secondPartIsNumber = /^\d+[a-z]?$/i.test(addressParts[1] ?? '');
  const street = addressParts.slice(0, secondPartIsNumber ? 2 : 1).join(' ');
  const city = addressParts.at(-3) ?? '';
  const number = street.match(/\b\d+[a-z]?\b/i)?.[0];
  const streetWords = significantWords(street).filter((word) => !/^\d/.test(word));
  const nameWords = significantWords(unit.name);
  const matchingStreetWords = streetWords.filter((word) => returned.includes(word));
  const matchingNameWords = nameWords.filter((word) => returned.includes(word));
  const numberMatches = !number || new RegExp(`\\b${number.toLowerCase()}\\b`).test(returned);
  const cityMatches = returned.includes(normalize(city));
  const postalMatches = returned.includes(normalize(unit.postalCode));
  const streetMatches = matchingStreetWords.length >= Math.min(2, Math.max(1, streetWords.length));
  const nameMatches = matchingNameWords.length >= Math.min(1, nameWords.length);
  const exactAddress = numberMatches && streetMatches && (cityMatches || postalMatches);
  const exactBusiness = nameMatches && (cityMatches || postalMatches);
  const verified = exactAddress || exactBusiness;

  return {
    verified,
    checks: {
      numberMatches,
      streetMatches,
      cityMatches,
      postalMatches,
      nameMatches,
      exactAddress,
      exactBusiness,
      matchingStreetWords,
      matchingNameWords,
    },
  };
};

const fetchGoogleLocation = async (unit) => {
  if (manualGoogleOverrides[unit.name]) {
    return {
      ...manualGoogleOverrides[unit.name],
      verified: true,
      checks: { manualOverride: true },
      query: 'Revisão manual no Google Maps e na página oficial da unidade',
    };
  }

  const cacheKey = `${unit.name}|${unit.address}|${unit.postalCode}`;
  if (googleCache[cacheKey]) {
    return { ...googleCache[cacheKey], ...validateResult(unit, googleCache[cacheKey]) };
  }

  const addressParts = unit.address.split(',').map((part) => part.trim());
  const cityAndRegion = addressParts.slice(-3).join(', ');

  const queries = [
    `Pratique Fitness ${unit.name}, ${unit.address}, ${unit.postalCode}`,
    `${unit.address}, ${unit.postalCode}`,
    unit.address,
    `Pratique Fitness ${unit.name}, ${cityAndRegion}`,
  ];

  let best = null;
  for (const query of queries) {
    const url = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed&hl=pt-BR`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36' },
    });
    if (!response.ok) throw new Error(`Google Maps respondeu ${response.status}`);
    const entity = parseGoogleEntity(await response.text());
    if (entity) {
      const validation = validateResult(unit, entity);
      const candidate = { ...entity, ...validation, query };
      if (!best || candidate.verified) best = candidate;
      if (candidate.verified) break;
    }
    await sleep(900);
  }

  if (!best) throw new Error('Nenhum estabelecimento ou endereço foi resolvido.');
  googleCache[cacheKey] = best;
  writeFileSync(googleCachePath, `${JSON.stringify(googleCache, null, 2)}\n`, 'utf8');
  await sleep(900);
  return best;
};

const audit = [];
for (let index = 0; index < units.length; index += 1) {
  const unit = units[index];
  process.stdout.write(`[${index + 1}/${units.length}] ${unit.name}... `);
  try {
    const google = await fetchGoogleLocation(unit);
    const distanceMeters = Math.round(haversineKm(unit.lat, unit.lng, google.lat, google.lng) * 1000);
    audit.push({
      name: unit.name,
      address: unit.address,
      postalCode: unit.postalCode,
      current: { lat: unit.lat, lng: unit.lng },
      google: { lat: google.lat, lng: google.lng, title: google.title, fullAddress: google.fullAddress },
      distanceMeters,
      verified: google.verified,
      checks: google.checks,
      query: google.query,
    });
    console.log(`${google.verified ? 'OK' : 'REVISAR'} (${distanceMeters} m)`);
  } catch (error) {
    audit.push({
      name: unit.name,
      address: unit.address,
      postalCode: unit.postalCode,
      current: { lat: unit.lat, lng: unit.lng },
      verified: false,
      error: error.message,
    });
    console.log(`ERRO: ${error.message}`);
  }
}

if (!requestedLimit) writeFileSync(auditPath, `${JSON.stringify(audit, null, 2)}\n`, 'utf8');

const verified = audit.filter((item) => item.verified && item.google);
const ambiguous = audit.filter((item) => !item.verified);
const changed = verified.filter((item) =>
  item.current.lat !== item.google.lat || item.current.lng !== item.google.lng
);

if (applyChanges) {
  if (requestedLimit) throw new Error('Não é permitido aplicar uma auditoria parcial.');
  if (ambiguous.length) {
    throw new Error(`Há ${ambiguous.length} resultados ambíguos. Revise o relatório antes de aplicar.`);
  }

  let nextUnits = readFileSync(unitsPath, 'utf8');
  let nextAddresses = readFileSync(addressesPath, 'utf8');
  const geocodeCache = JSON.parse(readFileSync(geocodeCachePath, 'utf8'));

  // Reescreve os dois arquivos para mantê-los sincronizados mesmo quando
  // apenas um deles já havia recebido a coordenada em uma execução anterior.
  for (const item of verified) {
    const escapedName = item.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const linePattern = new RegExp(`(name: "${escapedName}"[^\\n]*?lat: )-?\\d+(?:\\.\\d+)?, lng: -?\\d+(?:\\.\\d+)?`);
    nextUnits = nextUnits.replace(linePattern, `$1${item.google.lat}, lng: ${item.google.lng}`);
    const addressPattern = new RegExp(`("${escapedName}": \\{[^\\n]*?lat: )-?\\d+(?:\\.\\d+)?, lng: -?\\d+(?:\\.\\d+)?`);
    nextAddresses = nextAddresses.replace(addressPattern, `$1${item.google.lat}, lng: ${item.google.lng}`);
    const cacheKey = `${item.address}|${item.postalCode}`;
    geocodeCache[cacheKey] = { lat: item.google.lat, lng: item.google.lng };
  }

  writeFileSync(unitsPath, nextUnits, 'utf8');
  writeFileSync(addressesPath, nextAddresses, 'utf8');
  writeFileSync(geocodeCachePath, `${JSON.stringify(geocodeCache, null, 2)}\n`, 'utf8');
}

console.log(`\nVerificadas: ${verified.length}`);
console.log(`Ambíguas/erro: ${ambiguous.length}`);
console.log(`Coordenadas divergentes: ${changed.length}`);
console.log(`Alterações aplicadas: ${applyChanges ? changed.length : 0}`);
