import React from 'react';
import { TestimonialItem } from '../types/config';
import { FiX as X, FiArrowRight as ArrowRight } from 'react-icons/fi';
import { FaStar as Star, FaTrophy as Trophy, FaWhatsapp as MessageCircle } from 'react-icons/fa6';

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonials?: TestimonialItem[];
  whatsappNumber: string;
}

export const TestimonialModal: React.FC<TestimonialModalProps> = ({
  isOpen,
  onClose,
  testimonials = [],
  whatsappNumber
}) => {
  if (!isOpen) return null;

  const handleCTA = () => {
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    const msg = encodeURIComponent("Olá Gabriel! Vi os resultados incríveis dos seus alunos e quero ter uma transformação parecida. Como funciona?");
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Trophy color="var(--color-cyan)" size={24} />
            <span>Transformações & Depoimentos</span>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Resultados reais de pessoas comuns que seguiram a metodologia de treino e nutrição do Consultor Gabriel.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {testimonials.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden'
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={item.beforeAfterImg}
                    alt={`Transformação ${item.clientName}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    right: '10px',
                    background: 'rgba(10, 12, 14, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--color-accent)' }}>
                      🔥 {item.result}
                    </span>
                    <div style={{ display: 'flex', gap: '2px', color: '#fbbf24' }}>
                      {Array.from({ length: item.stars }).map((_, i) => (
                        <Star key={i} size={12} fill="#fbbf24" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800 }}>
                      {item.clientName}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.clientInfo}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: 1.4 }}>
                    "{item.comment}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-primary" onClick={handleCTA} style={{ marginTop: '10px' }}>
            <MessageCircle size={18} />
            <span>Quero Fazer Minha Transformação</span>
          </button>
        </div>
      </div>
    </div>
  );
};
