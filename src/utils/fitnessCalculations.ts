export type Gender = 'male' | 'female';
export type FitnessGoal = 'loss' | 'maintain' | 'gain';

export interface AssessmentInput {
  name: string;
  gender: Gender;
  age: number;
  weight: number;
  height: number;
  activity: number;
  trainingDays: number;
  goal: FitnessGoal;
  targetWeight: number;
}

export interface AssessmentResult {
  bmi: number;
  bmiCategory: string;
  bmiColor: string;
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  waterLiters: number;
  fiber: number;
  healthyWeightMin: number;
  healthyWeightMax: number;
  estimatedWeeks: number | null;
  steps: number;
  mealCalories: Array<{ label: string; calories: number; share: number }>;
  focusTips: string[];
}

export const goalLabels: Record<FitnessGoal, string> = {
  loss: 'Perder gordura',
  maintain: 'Manter o peso',
  gain: 'Ganhar massa'
};

export function calculateAssessment(input: AssessmentInput): AssessmentResult {
  const heightMeters = input.height / 100;
  const bmi = Number((input.weight / (heightMeters * heightMeters)).toFixed(1));
  let bmiCategory = 'Peso adequado';
  let bmiColor = '#10b981';

  if (bmi < 18.5) {
    bmiCategory = 'Abaixo do peso';
    bmiColor = '#38bdf8';
  } else if (bmi < 25) {
    bmiCategory = 'Peso adequado';
  } else if (bmi < 30) {
    bmiCategory = 'Sobrepeso';
    bmiColor = '#f59e0b';
  } else if (bmi < 35) {
    bmiCategory = 'Obesidade grau I';
    bmiColor = '#f97316';
  } else if (bmi < 40) {
    bmiCategory = 'Obesidade grau II';
    bmiColor = '#ef4444';
  } else {
    bmiCategory = 'Obesidade grau III';
    bmiColor = '#dc2626';
  }

  const bmr = Math.round(
    10 * input.weight + 6.25 * input.height - 5 * input.age + (input.gender === 'male' ? 5 : -161)
  );
  const tdee = Math.round(bmr * input.activity);
  const adjustment = input.goal === 'loss' ? 0.84 : input.goal === 'gain' ? 1.1 : 1;
  const calorieFloor = input.gender === 'female' ? 1200 : 1500;
  const calories = Math.max(calorieFloor, Math.round(tdee * adjustment));
  const proteinMultiplier = input.goal === 'gain' ? 2 : input.goal === 'loss' ? 1.8 : 1.6;
  const protein = Math.round(input.weight * proteinMultiplier);
  const fats = Math.round((calories * 0.25) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fats * 9) / 4));
  const waterLiters = Number(((input.weight * 35 + input.trainingDays * 80) / 1000).toFixed(1));
  const fiber = Math.round((calories / 1000) * 14);
  const healthyWeightMin = Number((18.5 * heightMeters * heightMeters).toFixed(1));
  const healthyWeightMax = Number((24.9 * heightMeters * heightMeters).toFixed(1));
  const difference = Math.abs(input.weight - input.targetWeight);
  const estimatedWeeks = input.goal === 'maintain' || difference < 0.5
    ? null
    : Math.max(1, Math.ceil(difference / (input.goal === 'loss' ? 0.5 : 0.3)));
  const steps = input.goal === 'loss' ? 9000 : input.goal === 'gain' ? 7000 : 8000;

  const mealShares = [
    { label: 'Café da manhã', share: 25 },
    { label: 'Almoço', share: 30 },
    { label: 'Lanche', share: 15 },
    { label: 'Jantar', share: 30 }
  ];
  const mealCalories = mealShares.map((meal) => ({
    ...meal,
    calories: Math.round(calories * (meal.share / 100))
  }));

  const focusTips: Record<FitnessGoal, string[]> = {
    loss: [
      `Mantenha uma rotina de ${Math.max(3, input.trainingDays)} sessões de atividade por semana.`,
      `Busque aproximadamente ${steps.toLocaleString('pt-BR')} passos ao dia, evoluindo gradualmente.`,
      'Priorize proteínas, vegetais e alimentos pouco processados para aumentar a saciedade.'
    ],
    maintain: [
      'Acompanhe peso, disposição e desempenho; pequenos ajustes são mais sustentáveis.',
      `Mantenha cerca de ${steps.toLocaleString('pt-BR')} passos ao dia e uma rotina ativa.`,
      'Distribua as fontes de proteína entre as principais refeições.'
    ],
    gain: [
      `Treine força de ${Math.max(3, input.trainingDays)} a 5 vezes por semana, respeitando a recuperação.`,
      'Aumente cargas ou repetições aos poucos para manter a progressão do treino.',
      'Use o superávit como ponto de partida e ajuste conforme a evolução do peso e das medidas.'
    ]
  };

  return {
    bmi,
    bmiCategory,
    bmiColor,
    bmr,
    tdee,
    calories,
    protein,
    carbs,
    fats,
    waterLiters,
    fiber,
    healthyWeightMin,
    healthyWeightMax,
    estimatedWeeks,
    steps,
    mealCalories,
    focusTips: focusTips[input.goal]
  };
}

export function haversineDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLng = toRadians(lng2 - lng1);
  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatPace(totalSeconds: number, distanceKm: number) {
  if (totalSeconds <= 0 || distanceKm <= 0) return '--:--';
  const paceSeconds = Math.round(totalSeconds / distanceKm);
  const minutes = Math.floor(paceSeconds / 60);
  const seconds = paceSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')} min/km`;
}

export function calculateOneRepMax(weight: number, repetitions: number) {
  if (weight <= 0 || repetitions <= 0) return 0;
  if (repetitions === 1) return Math.round(weight);
  return Math.round(weight * (1 + repetitions / 30));
}
