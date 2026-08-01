import React, { useEffect, useRef, useState } from 'react';
import {
  FiActivity as Activity,
  FiArrowLeft as ArrowLeft,
  FiArrowRight as ArrowRight,
  FiCheck as Check,
  FiClock as Clock,
  FiDownload as Download,
  FiDroplet as Droplet,
  FiImage as ImageIcon,
  FiMapPin as MapPin,
  FiNavigation as Navigation,
  FiRefreshCw as RefreshCw,
  FiShare2 as Share,
  FiTrash2 as Trash,
  FiTarget as Target,
  FiX as X,
  FiZap as Zap
} from 'react-icons/fi';
import { FaCalculator as Calculator, FaDumbbell as Dumbbell, FaWhatsapp as WhatsApp } from 'react-icons/fa6';
import confetti from 'canvas-confetti';
import { CustomSelect } from './CustomSelect';
import { PRATIQUE_UNIDADES_LIST, PratiqueUnit } from '../data/pratiqueUnits';
import {
  AssessmentInput,
  AssessmentResult,
  calculateAssessment,
  calculateOneRepMax,
  FitnessGoal,
  formatPace,
  goalLabels,
  haversineDistanceKm
} from '../utils/fitnessCalculations';
import { createStoryCard, downloadBlob } from '../utils/generateStoryCard';
import homemMagreza from '../image/imc-homem/magreza.png';
import homemNormal from '../image/imc-homem/normal.png';
import homemSobrepeso from '../image/imc-homem/sobrepeso.png';
import homemObesidade1 from '../image/imc-homem/obesidade-grau-1.png';
import homemObesidade2 from '../image/imc-homem/obesidade-grau-2.png';
import homemObesidade3 from '../image/imc-homem/obesidade-grau-3.png';
import mulherMagreza from '../image/imc-mulher/magreza.png';
import mulherNormal from '../image/imc-mulher/normal.png';
import mulherSobrepeso from '../image/imc-mulher/sobrepeso.png';
import mulherObesidade1 from '../image/imc-mulher/obesidade-grau-1.png';
import mulherObesidade2 from '../image/imc-mulher/obesidade-grau-2.png';
import mulherObesidade3 from '../image/imc-mulher/obesidade-grau-3.png';

interface MacroCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
}

type ToolView = 'home' | 'assessment' | 'water' | 'pace' | 'strength' | 'food';

const initialAssessment: AssessmentInput = {
  name: '',
  gender: 'male',
  age: 28,
  weight: 75,
  height: 175,
  activity: 1.375,
  trainingDays: 3,
  goal: 'loss',
  targetWeight: 68
};

const foods = [
  { id: 'rice', name: 'Arroz cozido', calories: 128, protein: 2.5, carbs: 28.1, fats: 0.2 },
  { id: 'beans', name: 'Feijão cozido', calories: 76, protein: 4.8, carbs: 13.6, fats: 0.5 },
  { id: 'potato', name: 'Batata inglesa cozida', calories: 52, protein: 1.2, carbs: 11.9, fats: 0.1 },
  { id: 'sweet-potato', name: 'Batata-doce cozida', calories: 77, protein: 0.6, carbs: 18.4, fats: 0.1 },
  { id: 'pasta', name: 'Macarrão cozido', calories: 157, protein: 5.8, carbs: 30.9, fats: 0.9 },
  { id: 'bread', name: 'Pão francês', calories: 300, protein: 8, carbs: 58.6, fats: 3.1 },
  { id: 'chicken', name: 'Peito de frango grelhado', calories: 159, protein: 32, carbs: 0, fats: 2.5 },
  { id: 'eggs', name: 'Ovo inteiro cozido', calories: 146, protein: 13.3, carbs: 0.6, fats: 9.5 }
];

const bmiImages = {
  male: [homemMagreza, homemNormal, homemSobrepeso, homemObesidade1, homemObesidade2, homemObesidade3],
  female: [mulherMagreza, mulherNormal, mulherSobrepeso, mulherObesidade1, mulherObesidade2, mulherObesidade3]
};

function getBmiImage(gender: AssessmentInput['gender'], bmi: number) {
  const index = bmi < 18.5 ? 0 : bmi < 25 ? 1 : bmi < 30 ? 2 : bmi < 35 ? 3 : bmi < 40 ? 4 : 5;
  return bmiImages[gender][index];
}

function ToolHeader({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  return (
    <div className="fitness-tool-heading">
      <button className="fitness-back-btn" onClick={onBack} aria-label="Voltar para a central">
        <ArrowLeft size={18} />
      </button>
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange, suffix, min, max, step = 1 }: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="form-group">
      <span className="form-label">{label}</span>
      <div className="fitness-input-wrap">
        <input
          className="form-input"
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        {suffix && <span>{suffix}</span>}
      </div>
    </label>
  );
}

function MetricCard({ label, value, detail, color }: { label: string; value: string; detail?: string; color?: string }) {
  return (
    <div className="fitness-metric-card">
      <span>{label}</span>
      <strong style={{ color: color || 'var(--text-main)' }}>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}

function SimpleToolCard({ icon, title, description, accent, onClick }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button className="fitness-tool-card" onClick={onClick} style={{ '--tool-accent': accent } as React.CSSProperties}>
      <span className="fitness-tool-icon">{icon}</span>
      <span className="fitness-tool-copy">
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <ArrowRight size={18} />
    </button>
  );
}

export const MacroCalculator: React.FC<MacroCalculatorProps> = ({ isOpen, onClose, whatsappNumber }) => {
  const [view, setView] = useState<ToolView>('home');

  const closeHub = () => {
    setView('home');
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeHub();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay fitness-hub-overlay" role="dialog" aria-modal="true" aria-label="Central fitness">
      <div className="modal-container fitness-hub-modal">
        <div className="modal-header fitness-hub-header">
          <div className="modal-title">
            <Calculator color="var(--color-accent)" size={23} />
            <span>Central Fitness</span>
          </div>
          <span className="fitness-free-badge">100% grátis</span>
          <button className="btn-close" onClick={closeHub} aria-label="Fechar"><X size={20} /></button>
        </div>

        <div className="modal-body fitness-hub-body">
          {view === 'home' && <FitnessHome onSelect={setView} />}
          {view === 'assessment' && <AssessmentTool onBack={() => setView('home')} whatsappNumber={whatsappNumber} />}
          {view === 'water' && <WaterTool onBack={() => setView('home')} />}
          {view === 'pace' && <PaceTool onBack={() => setView('home')} />}
          {view === 'strength' && <StrengthTool onBack={() => setView('home')} />}
          {view === 'food' && <FoodTool onBack={() => setView('home')} />}
        </div>
      </div>
    </div>
  );
};

function FitnessHome({ onSelect }: { onSelect: (tool: ToolView) => void }) {
  return (
    <div className="fitness-home">
      <div className="fitness-hero">
        <span className="fitness-eyebrow"><Zap size={14} /> Conheça seus números</span>
        <h2>Ferramentas para transformar seu treino.</h2>
        <p>Faça sua avaliação completa ou use uma calculadora rápida. Seus dados ficam somente no seu aparelho.</p>
      </div>

      <button className="fitness-featured-tool" onClick={() => onSelect('assessment')}>
        <span className="fitness-featured-icon"><Activity size={28} /></span>
        <span>
          <small>Recomendado</small>
          <strong>Avaliação Fitness Completa</strong>
          <p>IMC, calorias, macros, água, peso saudável, rotina e cartão para Stories.</p>
        </span>
        <ArrowRight size={22} />
      </button>

      <div className="fitness-tools-grid">
        <SimpleToolCard icon={<Droplet />} title="Água diária" description="Meta rápida de hidratação" accent="#00f2fe" onClick={() => onSelect('water')} />
        <SimpleToolCard icon={<Clock />} title="Ritmo de corrida" description="Pace e velocidade média" accent="#a855f7" onClick={() => onSelect('pace')} />
        <SimpleToolCard icon={<Dumbbell />} title="Carga máxima" description="Estimativa de 1RM" accent="#ff7a18" onClick={() => onSelect('strength')} />
        <SimpleToolCard icon={<RefreshCw />} title="Troca de alimentos" description="Equivalência por calorias" accent="#f59e0b" onClick={() => onSelect('food')} />
      </div>
      <p className="fitness-disclaimer">As ferramentas fornecem estimativas educativas para adultos e não substituem avaliação médica ou nutricional.</p>
    </div>
  );
}

function AssessmentTool({ onBack, whatsappNumber }: { onBack: () => void; whatsappNumber: string }) {
  const [input, setInput] = useState<AssessmentInput>(initialAssessment);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState('');

  const setField = <K extends keyof AssessmentInput>(field: K, value: AssessmentInput[K]) => {
    setInput((current) => ({ ...current, [field]: value }));
    setError('');
  };

  const validateStep = () => {
    if (step === 0 && (input.age < 18 || input.age > 80)) return 'Informe uma idade entre 18 e 80 anos.';
    if (step === 1 && (input.weight < 35 || input.weight > 300)) return 'Informe um peso entre 35 e 300 kg.';
    if (step === 1 && (input.height < 130 || input.height > 230)) return 'Informe uma altura entre 130 e 230 cm.';
    if (step === 2 && (input.trainingDays < 0 || input.trainingDays > 7)) return 'Informe de 0 a 7 treinos por semana.';
    if (step === 3 && (input.targetWeight < 35 || input.targetWeight > 300)) return 'Informe um peso-meta válido.';
    return '';
  };

  const nextStep = () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (step < 3) {
      setStep((current) => current + 1);
      return;
    }
    setResult(calculateAssessment(input));
    try { confetti({ particleCount: 70, spread: 70, origin: { y: 0.55 } }); } catch { /* visual extra */ }
  };

  if (result) {
    return (
      <AssessmentResults
        input={input}
        result={result}
        whatsappNumber={whatsappNumber}
        onRestart={() => { setResult(null); setStep(0); }}
        onBack={onBack}
      />
    );
  }

  const stepTitles = ['Você', 'Seu corpo', 'Sua rotina', 'Seu objetivo'];

  return (
    <div className="fitness-assessment">
      <ToolHeader title="Avaliação completa" subtitle="Leva menos de 2 minutos" onBack={onBack} />
      <div className="fitness-progress" aria-label={`Etapa ${step + 1} de 4`}>
        <div className="fitness-progress-copy"><span>Etapa {step + 1} de 4</span><strong>{stepTitles[step]}</strong></div>
        <div className="fitness-progress-track"><span style={{ width: `${((step + 1) / 4) * 100}%` }} /></div>
      </div>

      <div className="fitness-step-card">
        {step === 0 && (
          <>
            <div className="fitness-step-title"><span>01</span><div><h3>Vamos começar por você</h3><p>O nome é opcional e aparece somente no cartão.</p></div></div>
            <label className="form-group">
              <span className="form-label">Como podemos chamar você? (opcional)</span>
              <input className="form-input" value={input.name} maxLength={24} placeholder="Seu primeiro nome" onChange={(event) => setField('name', event.target.value)} />
            </label>
            <div className="form-group">
              <span className="form-label">Sexo usado no cálculo metabólico</span>
              <div className="fitness-choice-grid two">
                <button className={input.gender === 'male' ? 'selected' : ''} onClick={() => setField('gender', 'male')}><span>Homem</span>{input.gender === 'male' && <Check />}</button>
                <button className={input.gender === 'female' ? 'selected' : ''} onClick={() => setField('gender', 'female')}><span>Mulher</span>{input.gender === 'female' && <Check />}</button>
              </div>
            </div>
            <NumberField label="Idade" value={input.age} suffix="anos" min={18} max={80} onChange={(value) => setField('age', value)} />
          </>
        )}

        {step === 1 && (
          <>
            <div className="fitness-step-title"><span>02</span><div><h3>Medidas atuais</h3><p>Use valores recentes para uma estimativa melhor.</p></div></div>
            <div className="fitness-form-grid">
              <NumberField label="Peso" value={input.weight} suffix="kg" min={35} max={300} step={0.1} onChange={(value) => setField('weight', value)} />
              <NumberField label="Altura" value={input.height} suffix="cm" min={130} max={230} onChange={(value) => setField('height', value)} />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="fitness-step-title"><span>03</span><div><h3>Como é sua rotina?</h3><p>Considere sua movimentação durante toda a semana.</p></div></div>
            <div className="form-group">
              <span className="form-label">Nível de atividade</span>
              <CustomSelect
                value={input.activity}
                onChange={(value) => setField('activity', Number(value))}
                options={[
                  { value: 1.2, label: 'Baixo — pouco ou nenhum exercício' },
                  { value: 1.375, label: 'Moderado — treino 3 a 4x/semana' },
                  { value: 1.55, label: 'Alto — treino 5 a 6x/semana' },
                  { value: 1.725, label: 'Muito alto — atividade intensa diária' }
                ]}
              />
            </div>
            <NumberField label="Treinos por semana" value={input.trainingDays} suffix="dias" min={0} max={7} onChange={(value) => setField('trainingDays', value)} />
          </>
        )}

        {step === 3 && (
          <>
            <div className="fitness-step-title"><span>04</span><div><h3>Onde você quer chegar?</h3><p>A meta ajuda a personalizar suas estimativas.</p></div></div>
            <div className="fitness-goal-grid">
              {(['loss', 'maintain', 'gain'] as FitnessGoal[]).map((goal) => (
                <button key={goal} className={input.goal === goal ? 'selected' : ''} onClick={() => setField('goal', goal)}>
                  <Target size={19} /><span>{goalLabels[goal]}</span>{input.goal === goal && <Check size={16} />}
                </button>
              ))}
            </div>
            <NumberField label="Peso-meta" value={input.targetWeight} suffix="kg" min={35} max={300} step={0.1} onChange={(value) => setField('targetWeight', value)} />
          </>
        )}
      </div>

      {error && <p className="fitness-error" role="alert">{error}</p>}
      <div className="fitness-step-actions">
        {step > 0 && <button className="fitness-secondary-btn" onClick={() => { setStep((current) => current - 1); setError(''); }}><ArrowLeft /> Voltar</button>}
        <button className="btn-primary" onClick={nextStep}>{step === 3 ? 'Ver minha avaliação' : 'Continuar'} <ArrowRight /></button>
      </div>
    </div>
  );
}

function AssessmentResults({ input, result, whatsappNumber, onRestart, onBack }: {
  input: AssessmentInput;
  result: AssessmentResult;
  whatsappNumber: string;
  onRestart: () => void;
  onBack: () => void;
}) {
  const [storyBusy, setStoryBusy] = useState(false);
  const [nearestUnits, setNearestUnits] = useState<Array<PratiqueUnit & { distance: number }>>([]);
  const [locationState, setLocationState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [userPhotoUrl, setUserPhotoUrl] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const bmiImage = getBmiImage(input.gender, result.bmi);
  const storyImage = userPhotoUrl || bmiImage;

  useEffect(() => () => {
    if (userPhotoUrl) URL.revokeObjectURL(userPhotoUrl);
  }, [userPhotoUrl]);

  const storyFileName = `avaliacao-fitness-${input.name.trim().toLowerCase().replace(/\s+/g, '-') || 'resultado'}.png`;

  const generateStory = async (share = false) => {
    setStoryBusy(true);
    try {
      const blob = await createStoryCard(input, result, storyImage);
      const file = new File([blob], storyFileName, { type: 'image/png' });
      if (share && navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Minha avaliação fitness' });
      } else {
        downloadBlob(blob, storyFileName);
      }
    } catch (error) {
      if ((error as DOMException)?.name !== 'AbortError') window.alert('Não foi possível gerar o cartão agora. Tente novamente.');
    } finally {
      setStoryBusy(false);
    }
  };

  const findNearestUnits = () => {
    if (!navigator.geolocation) {
      setLocationState('error');
      return;
    }
    setLocationState('loading');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const closest = PRATIQUE_UNIDADES_LIST
          .map((unit) => ({ ...unit, distance: haversineDistanceKm(coords.latitude, coords.longitude, unit.lat, unit.lng) }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3);
        setNearestUnits(closest);
        setLocationState('idle');
      },
      () => setLocationState('error'),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  const selectPersonalPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.alert('Escolha um arquivo de imagem válido.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      window.alert('Escolha uma imagem de até 10 MB.');
      return;
    }
    setUserPhotoUrl(URL.createObjectURL(file));
  };

  const sendWhatsApp = () => {
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    const message = `Olá Gabriel! Fiz minha avaliação fitness${input.name ? ` (${input.name})` : ''}:\n\n` +
      `• Objetivo: ${goalLabels[input.goal]}\n• IMC: ${result.bmi} (${result.bmiCategory})\n` +
      `• Meta estimada: ${result.calories} kcal/dia\n• Proteína: ${result.protein}g/dia\n\n` +
      'Quero entender como aplicar esses números no meu treino e alimentação.';
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fitness-results">
      <ToolHeader title="Sua avaliação" subtitle={`${input.name ? `${input.name}, este` : 'Este'} é o seu ponto de partida`} onBack={onBack} />

      <section className="fitness-result-hero">
        <figure className="fitness-result-character">
          <img src={bmiImage} alt={`Ilustração corporal: ${result.bmiCategory}`} />
        </figure>
        <div className="fitness-result-bmi"><span>Seu IMC</span><strong style={{ color: result.bmiColor }}>{result.bmi}</strong><small style={{ color: result.bmiColor }}>{result.bmiCategory}</small></div>
        <div className="fitness-result-goal"><Target /><span>Objetivo</span><strong>{goalLabels[input.goal]}</strong></div>
      </section>

      <section>
        <div className="fitness-section-heading"><div><span>01</span><h3>Energia e composição</h3></div><small>estimativas diárias</small></div>
        <div className="fitness-metrics-grid">
          <MetricCard label="Meta calórica" value={`${result.calories} kcal`} detail="ponto de partida" color="var(--color-accent)" />
          <MetricCard label="Gasto total" value={`${result.tdee} kcal`} detail="com sua atividade" />
          <MetricCard label="Metabolismo basal" value={`${result.bmr} kcal`} detail="em repouso" />
          <MetricCard label="Faixa de peso" value={`${result.healthyWeightMin}–${result.healthyWeightMax} kg`} detail="referência pelo IMC" />
        </div>
      </section>

      <section>
        <div className="fitness-section-heading"><div><span>02</span><h3>Macros e hidratação</h3></div></div>
        <div className="fitness-macro-row">
          <MetricCard label="Proteína" value={`${result.protein} g`} />
          <MetricCard label="Carbos" value={`${result.carbs} g`} />
          <MetricCard label="Gorduras" value={`${result.fats} g`} />
        </div>
        <div className="fitness-wide-metrics">
          <div><Droplet /><span><small>Água estimada</small><strong>{result.waterLiters} litros/dia</strong></span></div>
          <div><Activity /><span><small>Fibras</small><strong>{result.fiber} g/dia</strong></span></div>
          <div><Navigation /><span><small>Movimento</small><strong>{result.steps.toLocaleString('pt-BR')} passos/dia</strong></span></div>
          {result.estimatedWeeks && <div><Clock /><span><small>Horizonte estimado</small><strong>cerca de {result.estimatedWeeks} semanas</strong></span></div>}
        </div>
      </section>

      <section>
        <div className="fitness-section-heading"><div><span>03</span><h3>Distribuição por refeições</h3></div></div>
        <div className="fitness-meal-list">
          {result.mealCalories.map((meal) => (
            <div key={meal.label}><span>{meal.label}</span><div><i style={{ width: `${meal.share}%` }} /></div><strong>{meal.calories} kcal</strong></div>
          ))}
        </div>
      </section>

      <section className="fitness-focus-card">
        <div className="fitness-section-heading"><div><span>04</span><h3>Seu foco agora</h3></div></div>
        <ul>{result.focusTips.map((tip) => <li key={tip}><Check /> <span>{tip}</span></li>)}</ul>
      </section>

      <section className="fitness-nearby-card">
        <div className="fitness-nearby-heading"><span><MapPin /><strong>Pratique mais perto de você</strong></span><small>Usamos sua localização somente neste momento.</small></div>
        {nearestUnits.length === 0 ? (
          <button className="fitness-location-btn" onClick={findNearestUnits} disabled={locationState === 'loading'}>
            <Navigation /> {locationState === 'loading' ? 'Buscando unidades...' : 'Encontrar academias próximas'}
          </button>
        ) : (
          <div className="fitness-unit-list">
            {nearestUnits.map((unit, index) => (
              <div key={`${unit.name}-${unit.lat}`}>
                <span className="fitness-unit-rank">{index + 1}</span>
                <span><strong>Pratique {unit.name}</strong><small>{unit.address} • {unit.distance.toFixed(1)} km em linha reta</small></span>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${unit.lat},${unit.lng}`} target="_blank" rel="noreferrer" aria-label={`Traçar rota para ${unit.name}`}><Navigation /></a>
              </div>
            ))}
          </div>
        )}
        {locationState === 'error' && <p className="fitness-error">Não conseguimos acessar sua localização. Libere a permissão do navegador e tente novamente.</p>}
      </section>

      <section className="fitness-story-section">
        <div className="fitness-story-preview">
          <span>GABRIEL LUCAS • @ogabriielvieira</span>
          <h3>MINHA<br />AVALIAÇÃO<br /><em>FITNESS</em></h3>
          <div className="fitness-story-person">
            <span><small>IMC</small><strong style={{ color: result.bmiColor }}>{result.bmi}</strong><i>{result.bmiCategory}</i></span>
            <img className={userPhotoUrl ? 'is-user-photo' : ''} src={storyImage} alt="" />
          </div>
          <ul><li><span>Calorias</span><b>{result.calories}</b></li><li><span>Proteína</span><b>{result.protein}g</b></li><li><span>Água</span><b>{result.waterLiters}L</b></li></ul>
          <footer>FAÇA SUA AVALIAÇÃO GRÁTIS</footer>
        </div>
        <div className="fitness-story-copy">
          <span className="fitness-eyebrow"><Share size={14} /> Formato 9:16</span>
          <h3>Compartilhe sua evolução nos Stories</h3>
          <p>O cartão é criado em 1080 × 1920 px e não envia seus dados para nenhum servidor.</p>
          <a className="fitness-instagram-link" href="https://www.instagram.com/ogabriielvieira/" target="_blank" rel="noreferrer">@ogabriielvieira</a>
          <div className="fitness-photo-picker">
            <input ref={photoInputRef} type="file" accept="image/*" onChange={selectPersonalPhoto} />
            <button type="button" onClick={() => photoInputRef.current?.click()}><ImageIcon /> {userPhotoUrl ? 'Trocar minha foto' : 'Usar minha foto'}</button>
            {userPhotoUrl && <button type="button" className="remove" onClick={() => setUserPhotoUrl('')} aria-label="Remover foto"><Trash /></button>}
            <small>A foto é usada somente para criar o cartão e não fica armazenada.</small>
          </div>
          <button className="btn-primary" disabled={storyBusy} onClick={() => generateStory(true)}><Share /> {storyBusy ? 'Gerando cartão...' : 'Compartilhar cartão'}</button>
          <button className="fitness-secondary-btn full" disabled={storyBusy} onClick={() => generateStory(false)}><Download /> Baixar imagem</button>
        </div>
      </section>

      <button className="btn-primary fitness-whatsapp-btn" onClick={sendWhatsApp}><WhatsApp /> Conversar sobre meu resultado</button>
      <button className="fitness-secondary-btn full" onClick={onRestart}><RefreshCw /> Refazer avaliação</button>
      <p className="fitness-disclaimer">Resultados estimativos para adultos. IMC não avalia sozinho composição corporal ou saúde. Procure profissionais habilitados para recomendações individuais.</p>
    </div>
  );
}

function WaterTool({ onBack }: { onBack: () => void }) {
  const [weight, setWeight] = useState(75);
  const [minutes, setMinutes] = useState(45);
  const liters = Math.max(0, Number(((weight * 35 + Math.max(0, minutes - 30) * 8) / 1000).toFixed(1)));
  return (
    <div className="fitness-simple-tool">
      <ToolHeader title="Água diária" subtitle="Uma referência rápida de hidratação" onBack={onBack} />
      <div className="fitness-simple-illustration cyan"><Droplet size={42} /><strong>{liters} L</strong><span>estimativa diária</span></div>
      <div className="fitness-step-card"><NumberField label="Seu peso" value={weight} suffix="kg" min={35} max={300} step={0.1} onChange={setWeight} /><NumberField label="Atividade no dia" value={minutes} suffix="min" min={0} max={300} onChange={setMinutes} /></div>
      <p className="fitness-tip">Clima, suor, alimentação e condições individuais alteram essa necessidade. Distribua o consumo ao longo do dia.</p>
    </div>
  );
}

function PaceTool({ onBack }: { onBack: () => void }) {
  const [distance, setDistance] = useState(5);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const speed = totalSeconds > 0 ? (distance / (totalSeconds / 3600)).toFixed(1) : '0.0';
  return (
    <div className="fitness-simple-tool">
      <ToolHeader title="Ritmo de corrida" subtitle="Calcule pace e velocidade média" onBack={onBack} />
      <div className="fitness-simple-illustration purple"><Clock size={42} /><strong>{formatPace(totalSeconds, distance)}</strong><span>{speed} km/h de velocidade média</span></div>
      <div className="fitness-step-card">
        <NumberField label="Distância" value={distance} suffix="km" min={0.1} max={500} step={0.1} onChange={setDistance} />
        <div className="fitness-form-grid three"><NumberField label="Horas" value={hours} min={0} max={48} onChange={setHours} /><NumberField label="Minutos" value={minutes} min={0} max={59} onChange={setMinutes} /><NumberField label="Segundos" value={seconds} min={0} max={59} onChange={setSeconds} /></div>
      </div>
    </div>
  );
}

function StrengthTool({ onBack }: { onBack: () => void }) {
  const [weight, setWeight] = useState(60);
  const [reps, setReps] = useState(8);
  const oneRm = calculateOneRepMax(weight, reps);
  return (
    <div className="fitness-simple-tool">
      <ToolHeader title="Carga máxima estimada" subtitle="Referência de uma repetição máxima (1RM)" onBack={onBack} />
      <div className="fitness-simple-illustration orange"><Dumbbell size={42} /><strong>{oneRm} kg</strong><span>1RM estimada pela fórmula de Epley</span></div>
      <div className="fitness-step-card"><div className="fitness-form-grid"><NumberField label="Carga utilizada" value={weight} suffix="kg" min={1} max={500} step={0.5} onChange={setWeight} /><NumberField label="Repetições" value={reps} suffix="reps" min={1} max={15} onChange={setReps} /></div></div>
      <div className="fitness-percentage-grid">{[90, 80, 70, 60].map((percentage) => <div key={percentage}><span>{percentage}%</span><strong>{Math.round(oneRm * percentage / 100)} kg</strong></div>)}</div>
      <p className="fitness-tip">Use como referência para planejar cargas. Não tente sua carga máxima sem técnica adequada e supervisão.</p>
    </div>
  );
}

function FoodTool({ onBack }: { onBack: () => void }) {
  const [sourceId, setSourceId] = useState('rice');
  const [targetId, setTargetId] = useState('potato');
  const [grams, setGrams] = useState(100);
  const source = foods.find((food) => food.id === sourceId)!;
  const target = foods.find((food) => food.id === targetId)!;
  const totalCalories = source.calories * grams / 100;
  const targetGrams = Math.round(totalCalories / target.calories * 100);
  return (
    <div className="fitness-simple-tool">
      <ToolHeader title="Troca de alimentos" subtitle="Compare por equivalência aproximada de calorias" onBack={onBack} />
      <div className="fitness-food-result"><span>{grams} g de <strong>{source.name}</strong></span><RefreshCw /><span>≈ {targetGrams} g de <strong>{target.name}</strong></span><small>aproximadamente {Math.round(totalCalories)} kcal</small></div>
      <div className="fitness-step-card">
        <div className="form-group"><span className="form-label">Alimento atual</span><CustomSelect value={sourceId} onChange={setSourceId} options={foods.map((food) => ({ value: food.id, label: food.name }))} /></div>
        <NumberField label="Quantidade" value={grams} suffix="g" min={1} max={1000} onChange={setGrams} />
        <div className="form-group"><span className="form-label">Quero trocar por</span><CustomSelect value={targetId} onChange={setTargetId} options={foods.map((food) => ({ value: food.id, label: food.name }))} /></div>
      </div>
      <div className="fitness-food-macros"><MetricCard label="Proteína atual" value={`${(source.protein * grams / 100).toFixed(1)} g`} /><MetricCard label="Proteína na troca" value={`${(target.protein * targetGrams / 100).toFixed(1)} g`} /></div>
      <p className="fitness-tip">Calorias equivalentes não significam nutrientes iguais. Use a comparação como referência, não como prescrição alimentar.</p>
    </div>
  );
}
