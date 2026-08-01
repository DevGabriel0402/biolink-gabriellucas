import React, { useState, useMemo } from 'react';
import { X, Search, MapPin, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import { PRATIQUE_UNIDADES_LIST, PratiqueUnit } from '../data/pratiqueUnits';

interface PratiqueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalityFilter = 'all' | 'natacao' | 'lutas';

const NATACAO_UNITS = [
  'guarani', 'cachoeirinha', 'sagrada', 'cidade nova', 'santa efigenia', 'santa efigênia',
  'sete lagoas', 'nova floresta', 'goiania', 'goiânia', 'cardoso', 'industrial',
  'sao bento', 'são bento', 'itabira', 'lindeia', 'lindéia', 'ribeiro de abreu'
];

const LUTA_UNITS = [
  'cachoeirinha', 'castelo', 'ceu azul', 'céu azul', 'cidade nova',
  'fernao dias', 'fernão dias', 'floramar', 'floresta', 'guarani',
  'heliopolis', 'heliópolis', 'lagoa', 'nova floresta', 'ouro preto',
  'pampulha', 'santa ines', 'santa inês', 'santa monica', 'santa mônica',
  'sao benedito', 'são benedito', 'vilarinho'
];

const hasNatacao = (unitName: string) => {
  const norm = unitName.toLowerCase();
  return NATACAO_UNITS.some(k => norm.includes(k));
};

const hasLuta = (unitName: string) => {
  const norm = unitName.toLowerCase();
  return LUTA_UNITS.some(k => norm.includes(k));
};

export const PratiqueModal: React.FC<PratiqueModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilter, setModalityFilter] = useState<ModalityFilter>('all');
  const [selectedUnit, setSelectedUnit] = useState<PratiqueUnit | null>(null);

  const logoUrl = "https://pratiquefitness.com.br/wp-content/uploads/2022/09/ZAP-GURU-VICTOR-4-5.png";

  const filteredUnits = useMemo(() => {
    let list = PRATIQUE_UNIDADES_LIST;

    if (modalityFilter === 'natacao') {
      list = list.filter(u => hasNatacao(u.name));
    } else if (modalityFilter === 'lutas') {
      list = list.filter(u => hasLuta(u.name));
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(u => u.name.toLowerCase().includes(term));
    }

    return list;
  }, [searchTerm, modalityFilter]);

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedUnit(null);
    setSearchTerm('');
    setModalityFilter('all');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '540px', width: '92%' }}>
        <button
          onClick={handleClose}
          className="btn-close"
          aria-label="Fechar modal"
        >
          <X size={20} />
        </button>

        <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Header with Logo */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '10px 18px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={logoUrl}
                alt="Pratique Fitness Logo"
                style={{ height: '38px', objectFit: 'contain' }}
              />
            </div>

            {!selectedUnit ? (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                  🎁 Faça sua Matrícula e Ganhe o Saver Club!
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  Escolha sua unidade abaixo para se matricular com <strong style={{ color: '#00e5a3' }}>Isenção de R$ 99,90 na taxa de matrícula</strong> e garantir o Saver Club <strong style={{ color: '#f59e0b' }}>(Válido a partir do PLANO PLUS)</strong>:
                </p>
              </div>
            ) : (
              <div>
                <span style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'inline-block',
                  marginBottom: '6px'
                }}>
                  Unidade Selecionada
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  {selectedUnit.name}
                </h3>
              </div>
            )}
          </div>

          {/* STEP 1: Unit Search, Filters & List */}
          {!selectedUnit ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Category Filter Pills (Natação / Lutas / Todas) */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
                <button
                  onClick={() => setModalityFilter('all')}
                  style={{
                    background: modalityFilter === 'all' ? '#ef4444' : 'rgba(255, 255, 255, 0.05)',
                    color: modalityFilter === 'all' ? '#fff' : 'var(--text-muted)',
                    border: '1px solid ' + (modalityFilter === 'all' ? '#ef4444' : 'var(--border-card)'),
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '0.775rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Todas (178)
                </button>
                <button
                  onClick={() => setModalityFilter('natacao')}
                  style={{
                    background: modalityFilter === 'natacao' ? '#00e5a3' : 'rgba(255, 255, 255, 0.05)',
                    color: modalityFilter === 'natacao' ? '#000' : 'var(--text-muted)',
                    border: '1px solid ' + (modalityFilter === 'natacao' ? '#00e5a3' : 'var(--border-card)'),
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '0.775rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>🏊 Natação</span>
                </button>
                <button
                  onClick={() => setModalityFilter('lutas')}
                  style={{
                    background: modalityFilter === 'lutas' ? '#f59e0b' : 'rgba(255, 255, 255, 0.05)',
                    color: modalityFilter === 'lutas' ? '#000' : 'var(--text-muted)',
                    border: '1px solid ' + (modalityFilter === 'lutas' ? '#f59e0b' : 'var(--border-card)'),
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '0.775rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>🥋 Lutas</span>
                </button>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="🔍 Digite sua cidade ou nome da unidade..."
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-card)',
                    borderRadius: '12px',
                    padding: '11px 14px 11px 42px',
                    color: 'var(--text-main)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                />
              </div>

              {/* Units List */}
              <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                paddingRight: '4px'
              }}>
                {filteredUnits.length > 0 ? (
                  filteredUnits.map((unit, idx) => {
                    const unitHasNatacao = hasNatacao(unit.name);
                    const unitHasLuta = hasLuta(unit.name);

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedUnit(unit)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-card)',
                          borderRadius: '12px',
                          padding: '11px 14px',
                          color: 'var(--text-main)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                          e.currentTarget.style.borderColor = '#ef4444';
                          e.currentTarget.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                          e.currentTarget.style.borderColor = 'var(--border-card)';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                          <MapPin size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{unit.name}</span>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {unitHasNatacao && (
                                <span style={{
                                  background: 'rgba(0, 229, 163, 0.15)',
                                  color: '#00e5a3',
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                  padding: '1px 6px',
                                  borderRadius: '4px'
                                }}>
                                  🏊 Natação
                                </span>
                              )}
                              {unitHasLuta && (
                                <span style={{
                                  background: 'rgba(245, 158, 11, 0.15)',
                                  color: '#f59e0b',
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                  padding: '1px 6px',
                                  borderRadius: '4px'
                                }}>
                                  🥋 Luta
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      </button>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Nenhuma unidade encontrada para esta busca/filtro.
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* STEP 2: Saver Club Benefits & Direct Link */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Saver Club Benefits Box */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '16px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
                  <Sparkles size={20} />
                  <strong style={{ fontSize: '1rem', color: '#fff' }}>O que você ganha com o Saver Club:</strong>
                </div>

                <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  O <strong>Saver Club</strong> faz parte do Projeto Saver, que financia bolsas de faculdade para a formação de novos profissionais de Educação Física. Ao apoiar o projeto, você recebe:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                    <span>🏷️</span>
                    <span><strong>Descontos em mais de 30 mil estabelecimentos</strong> em todo o Brasil.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                    <span>⚡</span>
                    <span><strong>Até 15% de desconto na conta de luz</strong> pela Igreen Energy.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                    <span>🎓</span>
                    <span><strong>Até 80% de desconto no Bolsa Mais Brasil</strong> para graduação, pós e técnicos.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                    <span>✈️</span>
                    <span><strong>Adesão grátis no RDC Viagens</strong> para planejar as viagens dos seus sonhos.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                    <span>💥</span>
                    <span><strong style={{ color: '#00e5a3' }}>Isenção de R$ 99,90 na Taxa de Matrícula</strong> na Pratique Fitness!</span>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '0.775rem',
                  color: '#f59e0b',
                  fontWeight: 700,
                  textAlign: 'center',
                  marginTop: '4px'
                }}>
                  ⚠️ A taxa de isenção de R$ 99,90 e o Saver Club são válidos exclusivamente para assinaturas a partir do <u>PLANO PLUS</u>.
                </div>
              </div>

              {/* Direct Site Link Button */}
              <a
                href={selectedUnit.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  padding: '14px',
                  boxShadow: '0 4px 20px rgba(239, 68, 68, 0.35)',
                  textDecoration: 'none'
                }}
              >
                <span>Fazer Matrícula na {selectedUnit.name}</span>
                <ExternalLink size={18} />
              </a>

              {/* Back to Unit List Button */}
              <button
                onClick={() => setSelectedUnit(null)}
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
                ← Escolher outra unidade da Pratique
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
