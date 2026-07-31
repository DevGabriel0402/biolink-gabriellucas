import React from 'react';
import { PlanItem } from '../types/config';
import { FiX as X, FiCheck as Check } from 'react-icons/fi';
import { FaFire as Flame, FaWhatsapp as MessageCircle, FaShieldHalved as ShieldCheck } from 'react-icons/fa6';

interface PlanComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  plans: PlanItem[];
  whatsappNumber: string;
}

export const PlanComparison: React.FC<PlanComparisonProps> = ({
  isOpen,
  onClose,
  plans,
  whatsappNumber
}) => {
  if (!isOpen) return null;

  const handleSelectPlan = (plan: PlanItem) => {
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    const featuresText = plan.features.map(f => `  • ${f}`).join('\n');
    const fullMessage = 
      `Olá Consultor Gabriel! Tenho interesse em assinar a consultoria. Escolhi o seguinte plano:\n\n` +
      `📌 *NOME DO PLANO:* ${plan.title}\n` +
      `💵 *PREÇO:* ${plan.price} ${plan.period}\n` +
      `📝 *DESCRIÇÃO:* ${plan.tagline}\n\n` +
      `✅ *BENEFÍCIOS INCLUSOS:*\n${featuresText}\n\n` +
      `Como faço para confirmar minha vaga?`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(fullMessage)}`, '_blank');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Flame color="var(--color-accent)" size={24} />
            <span>Planos de Consultoria VIP</span>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div style={{
            background: 'rgba(212, 255, 0, 0.08)',
            border: '1px solid rgba(212, 255, 0, 0.25)',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <ShieldCheck color="var(--color-accent)" size={22} style={{ flexShrink: 0 }} />
            <span><strong>Garantia Incondicional de 7 dias:</strong> Se não gostar da consultoria, devolvemos 100% do seu investimento.</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`plan-card ${plan.featured ? 'featured' : ''}`}
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                {plan.badge && <span className="plan-badge">{plan.badge}</span>}

                {/* 1. Nome do Plano */}
                <h3 className="plan-name">{plan.title}</h3>

                {/* 2. Preço */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span className="plan-price">{plan.price}</span>
                  <span className="plan-period">{plan.period}</span>
                  {plan.originalPrice && (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through', marginLeft: 'auto' }}>
                      {plan.originalPrice}
                    </span>
                  )}
                </div>

                {/* 3. Descrição */}
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '2px 0 4px' }}>
                  {plan.tagline}
                </p>

                <ul className="plan-feature-list">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="plan-feature-item">
                      <Check size={16} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className="btn-primary"
                  onClick={() => handleSelectPlan(plan)}
                >
                  <MessageCircle size={18} />
                  <span>{plan.featured ? 'Garantir Vaga VIP no WhatsApp' : 'Quero Este Plano'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
