import React, { useState } from 'react';
import { FiX as X, FiZap as Zap } from 'react-icons/fi';
import { FaWhatsapp as MessageCircle, FaCalculator as Calculator } from 'react-icons/fa6';
import { HiSparkles as Sparkles } from 'react-icons/hi2';
import confetti from 'canvas-confetti';
import { CustomSelect } from './CustomSelect';

import magrezaImg from '../image/imc-homem/magreza.png';
import normalImg from '../image/imc-homem/normal.png';
import sobrepesoImg from '../image/imc-homem/sobrepeso.png';
import obesidade1Img from '../image/imc-homem/obesidade-grau-1.png';
import obesidade2Img from '../image/imc-homem/obesidade-grau-2.png';
import obesidade3Img from '../image/imc-homem/obesidade-grau-3.png';

import magrezaMulherImg from '../image/imc-mulher/magreza.png';
import normalMulherImg from '../image/imc-mulher/normal.png';
import sobrepesoMulherImg from '../image/imc-mulher/sobrepeso.png';
import obesidade1MulherImg from '../image/imc-mulher/obesidade-grau-1.png';
import obesidade2MulherImg from '../image/imc-mulher/obesidade-grau-2.png';
import obesidade3MulherImg from '../image/imc-mulher/obesidade-grau-3.png';

interface MacroCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
}

export const MacroCalculator: React.FC<MacroCalculatorProps> = ({
  isOpen,
  onClose,
  whatsappNumber
}) => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(28);
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(175);
  const [activity, setActivity] = useState<number>(1.375); // 1.2: Sedentary, 1.375: Moderate, 1.55: Active, 1.725: Very Active
  const [goal, setGoal] = useState<'loss' | 'maintain' | 'gain'>('loss');

  const [result, setResult] = useState<{
    calories: number;
    bmr: number;
    tdee: number;
    protein: number;
    carbs: number;
    fats: number;
    bmi: number;
    bmiCategory: string;
    bmiColor: string;
    bmiImage: string;
    persuasiveMsg: string;
  } | null>(null);

  if (!isOpen) return null;

  const calculateMacros = () => {
    // Mifflin-St Jeor BMR Formula (Taxa Metabólica Basal - TMB)
    let bmrVal = Math.round(10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161));

    // Total Daily Energy Expenditure (TDEE - Gasto Calórico Total Diário)
    let tdeeVal = Math.round(bmrVal * activity);

    // Adjust for Goal (Déficit ou Superávit Calórico)
    let targetCalories = tdeeVal;
    if (goal === 'loss') targetCalories = Math.round(tdeeVal - 450);
    else if (goal === 'gain') targetCalories = Math.round(tdeeVal + 350);

    // Macro splits
    let proteinMultiplier = goal === 'gain' ? 2.2 : goal === 'loss' ? 2.0 : 1.8;
    const proteinGrams = Math.round(weight * proteinMultiplier);
    const fatGrams = Math.round((targetCalories * 0.25) / 9);
    const carbGrams = Math.round((targetCalories - (proteinGrams * 4 + fatGrams * 9)) / 4);

    // IMC (Índice de Massa Corporal) Calculation & Body Shape Selection
    const heightInMeters = height / 100;
    const bmiVal = heightInMeters > 0 ? Number((weight / (heightInMeters * heightInMeters)).toFixed(1)) : 0;
    let bmiCategory = '';
    let bmiColor = '#10b981';

    const isFemale = gender === 'female';
    let bmiImage = isFemale ? normalMulherImg : normalImg;
    let persuasiveMsg = '';

    if (bmiVal < 18.5) {
      bmiCategory = 'Magreza (Abaixo do peso)';
      bmiColor = '#38bdf8';
      bmiImage = isFemale ? magrezaMulherImg : magrezaImg;
      persuasiveMsg = '🎯 Estar abaixo do peso exige um treino e dieta focados em ganho de massa magra sem acumular gordura. O Gabriel pode criar uma rotina perfeita para você encorpar com saúde!';
    } else if (bmiVal <= 24.9) {
      bmiCategory = 'Peso Normal (Saudável)';
      bmiColor = '#10b981';
      bmiImage = isFemale ? normalMulherImg : normalImg;
      persuasiveMsg = '⚡ Você está no peso ideal! Agora é a hora de trincar o abdômen e tonificar os músculos. O Gabriel vai te ajudar a alcançar o seu ápice físico definitivo!';
    } else if (bmiVal <= 29.9) {
      bmiCategory = 'Sobrepeso (Excesso leve)';
      bmiColor = '#f59e0b';
      bmiImage = isFemale ? sobrepesoMulherImg : sobrepesoImg;
      persuasiveMsg = '🔥 O momento perfeito para virar o jogo! Com o método de déficit calórico sem passar fome do Gabriel, você vai secar a gordura abdominal rapidamente e definir o corpo!';
    } else if (bmiVal <= 34.9) {
      bmiCategory = 'Obesidade Grau 1';
      bmiColor = '#ef4444';
      bmiImage = isFemale ? obesidade1MulherImg : obesidade1Img;
      persuasiveMsg = '🚀 Sua transformação começa hoje! Eliminar o excesso de peso vai renovar sua disposição, saúde e autoestima. Fale com o Gabriel para começar do jeito certo!';
    } else if (bmiVal <= 39.9) {
      bmiCategory = 'Obesidade Grau 2';
      bmiColor = '#ef4444';
      bmiImage = isFemale ? obesidade2MulherImg : obesidade2Img;
      persuasiveMsg = '💪 Sua saúde e autoestima em primeiro lugar! Com um plano sob medida adaptado à sua rotina, o Gabriel vai te guiar passo a passo com total segurança!';
    } else {
      bmiCategory = 'Obesidade Grau 3';
      bmiColor = '#dc2626';
      bmiImage = isFemale ? obesidade3MulherImg : obesidade3Img;
      persuasiveMsg = '🛡️ Tome o controle do seu futuro hoje! Não adie seu bem-estar. O Gabriel oferece acompanhamento 100% próximo para transformar a sua vida e saúde!';
    }

    setResult({
      calories: targetCalories,
      bmr: bmrVal,
      tdee: tdeeVal,
      protein: proteinGrams,
      carbs: carbGrams,
      fats: fatGrams,
      bmi: bmiVal,
      bmiCategory,
      bmiColor,
      bmiImage,
      persuasiveMsg
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback if confetti not loaded
    }
  };

  const handleSendToWhatsApp = () => {
    if (!result) return;
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    const goalText = goal === 'loss' ? 'Perder Gordura/Trincar (Déficit Calórico)' : goal === 'gain' ? 'Ganhar Massa Muscular (Superávit Calórico)' : 'Manter Peso';
    const text = `Olá Gabriel! Usei a calculadora da sua BioLink e meus resultados foram:\n` +
      `• IMC: ${result.bmi} (${result.bmiCategory})\n` +
      `• Taxa Metabólica Basal (TMB): ${result.bmr} kcal/dia\n` +
      `• Meta Calórica (${goalText}): ${result.calories} kcal/dia\n` +
      `• Proteína: ${result.protein}g | Carbos: ${result.carbs}g | Gorduras: ${result.fats}g\n\n` +
      `Gostaria de saber como encaixar isso no meu plano com sua consultoria!`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Calculator color="var(--color-emerald)" size={24} />
            <span>Calculadora de Macros, Calorias & IMC</span>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {!result ? (
            /* Form View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Gender Toggle */}
              <div className="form-group">
                <label className="form-label">Gênero</label>
                <div className="tab-bar">
                  <button
                    className={`tab-btn ${gender === 'male' ? 'active' : ''}`}
                    onClick={() => setGender('male')}
                  >
                    Homem
                  </button>
                  <button
                    className={`tab-btn ${gender === 'female' ? 'active' : ''}`}
                    onClick={() => setGender('female')}
                  >
                    Mulher
                  </button>
                </div>
              </div>

              {/* Age, Weight, Height Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Idade</label>
                  <input
                    type="number"
                    className="form-input"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Peso (kg)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Altura (cm)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Activity Level */}
              <div className="form-group">
                <label className="form-label">Nível de Atividade</label>
                <CustomSelect
                  value={activity}
                  onChange={(val) => setActivity(Number(val))}
                  options={[
                    { value: 1.2, label: 'Sedentário (Pouco ou nenhum exercício)' },
                    { value: 1.375, label: 'Moderado (Treino 3 a 4x na semana)' },
                    { value: 1.55, label: 'Intenso (Treino 5 a 6x na semana)' },
                    { value: 1.725, label: 'Atleta / Treino Pesado Diário' }
                  ]}
                />
              </div>

              {/* Goal */}
              <div className="form-group">
                <label className="form-label">Objetivo Principal</label>
                <div className="tab-bar">
                  <button
                    className={`tab-btn ${goal === 'loss' ? 'active' : ''}`}
                    onClick={() => setGoal('loss')}
                  >
                    🔥 Perder Gordura
                  </button>
                  <button
                    className={`tab-btn ${goal === 'maintain' ? 'active' : ''}`}
                    onClick={() => setGoal('maintain')}
                  >
                    ⚖️ Manter Peso
                  </button>
                  <button
                    className={`tab-btn ${goal === 'gain' ? 'active' : ''}`}
                    onClick={() => setGoal('gain')}
                  >
                    💪 Ganhar Massa
                  </button>
                </div>
              </div>

              {/* Calculate Button */}
              <button className="btn-primary" onClick={calculateMacros} style={{ marginTop: '6px' }}>
                <Zap size={18} />
                <span>Calcular Resultado</span>
              </button>
            </div>
          ) : (
            /* Exclusive Results View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.3s ease-out' }}>
              
              {/* 1. IMC Header Text (Smaller on top) */}
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', display: 'block' }}>
                  Seu IMC (Índice de Massa Corporal)
                </span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '2px' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: result.bmiColor, fontFamily: 'var(--font-heading)' }}>
                    {result.bmi}
                  </span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: result.bmiColor }}>
                    • {result.bmiCategory}
                  </span>
                </div>
              </div>

              {/* 2. Large Highlighted Body Image */}
              {result.bmiImage && (
                <div style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: `2px solid ${result.bmiColor}`,
                  boxShadow: `0 0 25px ${result.bmiColor}25`,
                  borderRadius: '20px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '210px',
                  width: '100%'
                }}>
                  <img
                    src={result.bmiImage}
                    alt={`Ilustração ${result.bmiCategory}`}
                    style={{ height: '100%', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.6))' }}
                  />
                </div>
              )}

              {/* 3. Calories, BMR & Macros Section */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid var(--border-card)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.725rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'block' }}>
                    Meta Calórica Sugerida ({goal === 'loss' ? 'Déficit Calórico' : goal === 'gain' ? 'Superávit Calórico' : 'Manutenção'})
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', fontWeight: 900, color: 'var(--color-emerald)' }}>
                    {result.calories} <span style={{ fontSize: '1rem', color: 'var(--text-main)' }}>kcal/dia</span>
                  </h3>
                </div>

                {/* BMR & TDEE mini stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', textAlign: 'center' }}>
                  <div style={{ background: 'rgba(255,255,255,0.04)', padding: '8px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ display: 'block', fontSize: '0.675rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TMB (Gasto em Repouso)</span>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--color-cyan)' }}>{result.bmr} kcal</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.04)', padding: '8px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ display: 'block', fontSize: '0.675rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gasto Total (Com Treinos)</span>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--color-orange)' }}>{result.tdee} kcal</strong>
                  </div>
                </div>

                {/* Macro Distribution */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 6px', borderRadius: '10px' }}>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Proteína</span>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>{result.protein}g</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 6px', borderRadius: '10px' }}>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Carbos</span>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>{result.carbs}g</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 6px', borderRadius: '10px' }}>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Gordura</span>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--text-main)' }}>{result.fats}g</strong>
                  </div>
                </div>
              </div>

              {/* 4. Brief Explanation Card */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-card)',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent)' }}>
                  <Sparkles size={16} />
                  <strong style={{ fontSize: '0.85rem' }}>Entenda seus números:</strong>
                </div>
                <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  • <strong style={{ color: 'var(--text-main)' }}>TMB (Taxa Metabólica Basal):</strong> É o mínimo de energia (calorias) que seu corpo gasta em repouso apenas para te manter vivo (respirar, bater o coração).
                </p>
                <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  • <strong style={{ color: 'var(--text-main)' }}>{goal === 'loss' ? 'Déficit Calórico (comer menos do que gasta):' : goal === 'gain' ? 'Superávit Calórico (comer mais do que gasta):' : 'Manutenção Calórica:'}</strong> {goal === 'loss' ? 'Consumir menos calorias do que o seu gasto diário força o organismo a queimar a gordura estocada para gerar energia.' : goal === 'gain' ? 'Adicionar calorias extras fornece os nutrientes e a energia para construir novos músculos com máxima velocidade.' : 'Equilibrar a quantidade ingerida com o gasto garante a manutenção do seu peso.'}
                </p>
              </div>

              {/* 5. Persuasive Marketing CTA Card */}
              {result.persuasiveMsg && (
                <div style={{
                  background: 'rgba(0, 229, 163, 0.08)',
                  border: '1px solid var(--color-accent-glow)',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  <div style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-accent)' }}>
                    <Sparkles size={18} />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.45, fontWeight: 600 }}>
                    {result.persuasiveMsg}
                  </p>
                </div>
              )}

              {/* 6. Action Buttons */}
              <button
                onClick={handleSendToWhatsApp}
                className="btn-primary"
                style={{ background: '#25D366', color: '#000', fontWeight: 800 }}
              >
                <MessageCircle size={18} />
                <span>Enviar Resultado p/ Gabriel no WhatsApp</span>
              </button>

              <button
                onClick={() => setResult(null)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-card)',
                  color: 'var(--text-muted)',
                  padding: '10px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                ← Refazer Cálculo / Alterar Dados
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
