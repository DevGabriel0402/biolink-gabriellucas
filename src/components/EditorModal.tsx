import React, { useState } from 'react';
import { BioLinkConfig, LinkItem, PlanItem, TestimonialItem } from '../types/config';
import { 
  FiX as X, 
  FiSettings as Settings, 
  FiUser as User, 
  FiLink as LinkIcon, 
  FiDollarSign as DollarSign, 
  FiAward as Award, 
  FiDownload as Download, 
  FiUpload as Upload, 
  FiRotateCcw as RotateCcw, 
  FiPlus as Plus, 
  FiTrash2 as Trash2, 
  FiCheck as Check 
} from 'react-icons/fi';
import { FaPalette as Palette } from 'react-icons/fa6';
import { CustomSelect } from './CustomSelect';

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BioLinkConfig;
  onChangeConfig: (newConfig: BioLinkConfig) => void;
  onResetDefault: () => void;
}

export const EditorModal: React.FC<EditorModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  onResetDefault
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'links' | 'plans' | 'testimonials' | 'ebooks' | 'theme'>('profile');

  if (!isOpen) return null;

  // Handler helpers
  const handleProfileChange = (field: string, value: any) => {
    onChangeConfig({
      ...config,
      profile: {
        ...config.profile,
        [field]: value
      }
    });
  };

  const handleStatChange = (index: number, field: string, value: string) => {
    const updatedStats = [...config.profile.stats];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    handleProfileChange('stats', updatedStats);
  };

  const handleLinkChange = (index: number, field: string, value: any) => {
    const updatedLinks = [...config.links];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    onChangeConfig({ ...config, links: updatedLinks });
  };

  const handleAddLink = () => {
    const newLink: LinkItem = {
      id: `link-${Date.now()}`,
      title: "Novo Link Persuasivo",
      subtitle: "Descrição curta do link",
      iconName: "Zap",
      type: "whatsapp",
      featured: false,
      animation: "none"
    };
    onChangeConfig({ ...config, links: [...config.links, newLink] });
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = config.links.filter((_, i) => i !== index);
    onChangeConfig({ ...config, links: updatedLinks });
  };

  const handlePlanChange = (index: number, field: string, value: any) => {
    const updatedPlans = [...config.plans];
    updatedPlans[index] = { ...updatedPlans[index], [field]: value };
    onChangeConfig({ ...config, plans: updatedPlans });
  };

  const handleEbookChange = (index: number, field: string, value: any) => {
    const currentEbooks = config.ebooks || [];
    const updatedEbooks = [...currentEbooks];
    updatedEbooks[index] = { ...updatedEbooks[index], [field]: value };
    onChangeConfig({ ...config, ebooks: updatedEbooks });
  };

  const handleAddEbook = () => {
    const currentEbooks = config.ebooks || [];
    const newEbook = {
      id: `ebook-${Date.now()}`,
      title: "Novo E-book em PDF",
      description: "Descrição rápida do conteúdo do arquivo PDF.",
      pdfUrl: "",
      badge: "PDF"
    };
    onChangeConfig({ ...config, ebooks: [...currentEbooks, newEbook] });
  };

  const handleRemoveEbook = (index: number) => {
    const currentEbooks = config.ebooks || [];
    const updatedEbooks = currentEbooks.filter((_, i) => i !== index);
    onChangeConfig({ ...config, ebooks: updatedEbooks });
  };

  const handleThemeColor = (accentColor: string) => {
    onChangeConfig({
      ...config,
      theme: {
        ...config.theme,
        accentColor
      }
    });
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "biolink-config.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.profile && parsed.links) {
            onChangeConfig(parsed);
            alert("Configuração importada com sucesso!");
          }
        } catch {
          alert("Arquivo JSON inválido.");
        }
      };
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '580px' }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Settings color="var(--color-accent)" size={24} />
            <span>Painel de Edição ao Vivo</span>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        {/* Action bar for Quick Save & Return to Main BioLink */}
        <div style={{ padding: '12px 24px 0' }}>
          <button
            className="btn-primary"
            onClick={onClose}
            style={{
              background: 'var(--color-accent)',
              color: 'var(--text-dark)',
              fontSize: '0.9rem',
              padding: '12px 18px',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <Check size={18} />
            <span>💾 Salvar e Ver BioLink Pública ( / )</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ padding: '12px 24px 0', background: 'rgba(255, 255, 255, 0.02)' }}>
          <div className="tab-bar">
            <button
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Perfil
            </button>
            <button
              className={`tab-btn ${activeTab === 'links' ? 'active' : ''}`}
              onClick={() => setActiveTab('links')}
            >
              Links ({config.links.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'plans' ? 'active' : ''}`}
              onClick={() => setActiveTab('plans')}
            >
              Planos
            </button>
            <button
              className={`tab-btn ${activeTab === 'ebooks' ? 'active' : ''}`}
              onClick={() => setActiveTab('ebooks')}
            >
              PDFs ({config.ebooks?.length || 0})
            </button>
            <button
              className={`tab-btn ${activeTab === 'theme' ? 'active' : ''}`}
              onClick={() => setActiveTab('theme')}
            >
              Tema & JSON
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Nome do Personal Trainer</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Título / Subtítulo</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.profile.title}
                  onChange={(e) => handleProfileChange('title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio Persuasiva</label>
                <textarea
                  className="form-textarea"
                  value={config.profile.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL da Foto de Perfil</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.profile.avatarUrl}
                  onChange={(e) => handleProfileChange('avatarUrl', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Número do WhatsApp (com DDD e 55)</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.profile.whatsappNumber}
                  onChange={(e) => handleProfileChange('whatsappNumber', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Badge de Urgência (Vagas)</label>
                <input
                  type="text"
                  className="form-input"
                  value={config.profile.openSpotsBadge}
                  onChange={(e) => handleProfileChange('openSpotsBadge', e.target.value)}
                />
              </div>

              {/* Stats */}
              <label className="form-label" style={{ marginTop: '6px' }}>Estatísticas de Impacto</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {config.profile.stats.map((stat, idx) => (
                  <div key={stat.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Valor"
                      value={stat.value}
                      onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Legenda"
                      value={stat.label}
                      onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LINKS TAB */}
          {activeTab === 'links' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {config.links.map((link, idx) => (
                <div
                  key={link.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-card)',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                      Card #{idx + 1}
                    </span>
                    <button
                      onClick={() => handleRemoveLink(idx)}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Título do Link</label>
                    <input
                      type="text"
                      className="form-input"
                      value={link.title}
                      onChange={(e) => handleLinkChange(idx, 'title', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subtítulo</label>
                    <input
                      type="text"
                      className="form-input"
                      value={link.subtitle || ''}
                      onChange={(e) => handleLinkChange(idx, 'subtitle', e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div className="form-group">
                      <label className="form-label">Ícone</label>
                      <CustomSelect
                        value={link.iconName}
                        onChange={(val) => handleLinkChange(idx, 'iconName', val)}
                        options={[
                          { value: 'Flame', label: 'Fogo (Flame)' },
                          { value: 'Trophy', label: 'Troféu (Trophy)' },
                          { value: 'Calculator', label: 'Calculadora' },
                          { value: 'BookOpen', label: 'Livro (E-book)' },
                          { value: 'MessageCircle', label: 'WhatsApp' },
                          { value: 'Dumbbell', label: 'Haltere' },
                          { value: 'Zap', label: 'Raio (Zap)' },
                          { value: 'Sparkles', label: 'Brilho' }
                        ]}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tipo de Ação</label>
                      <CustomSelect
                        value={link.type}
                        onChange={(val) => handleLinkChange(idx, 'type', val)}
                        options={[
                          { value: 'modal_plans', label: 'Abrir Modal de Planos' },
                          { value: 'modal_testimonials', label: 'Abrir Depoimentos' },
                          { value: 'modal_macro', label: 'Abrir Calculadora' },
                          { value: 'modal_ebook', label: 'Abrir E-book' },
                          { value: 'whatsapp', label: 'Abrir WhatsApp Direct' },
                          { value: 'external', label: 'URL Externa' }
                        ]}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div className="form-group">
                      <label className="form-label">Badge Destaque</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ex: O MAIS PEDIDO"
                        value={link.badge || ''}
                        onChange={(e) => handleLinkChange(idx, 'badge', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Animação</label>
                      <CustomSelect
                        value={link.animation || 'none'}
                        onChange={(val) => handleLinkChange(idx, 'animation', val)}
                        options={[
                          { value: 'none', label: 'Nenhuma' },
                          { value: 'glow', label: 'Borda Brilhante (Glow)' },
                          { value: 'pulse', label: 'Pulso (Pulse)' }
                        ]}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button className="btn-primary" onClick={handleAddLink} style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-main)', boxShadow: 'none' }}>
                <Plus size={18} />
                <span>Adicionar Novo Card</span>
              </button>
            </div>
          )}

          {/* PLANS TAB */}
          {activeTab === 'plans' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {config.plans.map((plan, idx) => (
                <div key={plan.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ color: 'var(--color-accent)', fontWeight: 800 }}>Plano #{idx + 1}: {plan.title}</h4>
                  
                  <div className="form-group">
                    <label className="form-label">Nome do Plano</label>
                    <input
                      type="text"
                      className="form-input"
                      value={plan.title}
                      onChange={(e) => handlePlanChange(idx, 'title', e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div className="form-group">
                      <label className="form-label">Preço (R$)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={plan.price}
                        onChange={(e) => handlePlanChange(idx, 'price', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Período</label>
                      <input
                        type="text"
                        className="form-input"
                        value={plan.period}
                        onChange={(e) => handlePlanChange(idx, 'period', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EBOOKS / PDFS TAB */}
          {activeTab === 'ebooks' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(config.ebooks || []).map((ebook, idx) => (
                <div key={ebook.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ color: 'var(--color-purple)', fontWeight: 800 }}>PDF #{idx + 1}: {ebook.title}</h4>
                    <button
                      onClick={() => handleRemoveEbook(idx)}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Título do PDF / E-book</label>
                    <input
                      type="text"
                      className="form-input"
                      value={ebook.title}
                      onChange={(e) => handleEbookChange(idx, 'title', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Descrição Curta</label>
                    <input
                      type="text"
                      className="form-input"
                      value={ebook.description}
                      onChange={(e) => handleEbookChange(idx, 'description', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Link do Arquivo PDF (Google Drive / S3 / Dropbox / URL Direta)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Cole aqui o link do seu PDF (ou deixe em branco p/ PDF automático)"
                      value={ebook.pdfUrl || ''}
                      onChange={(e) => handleEbookChange(idx, 'pdfUrl', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Badge Tag</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: RECEITAS FIT"
                      value={ebook.badge || ''}
                      onChange={(e) => handleEbookChange(idx, 'badge', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Créditos / Autor do Conteúdo</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: Tiago Nutri"
                      value={ebook.authorCredit || ''}
                      onChange={(e) => handleEbookChange(idx, 'authorCredit', e.target.value)}
                    />
                  </div>
                </div>
              ))}

              <button className="btn-primary" onClick={handleAddEbook} style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-main)', boxShadow: 'none' }}>
                <Plus size={18} />
                <span>Adicionar Novo PDF à Biblioteca</span>
              </button>
            </div>
          )}

          {/* THEME & JSON TAB */}
          {activeTab === 'theme' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="form-group">
                <label className="form-label">Cor de Destaque (Accent Theme)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {[
                    { label: 'Verde Mint Clean', color: '#00e5a3' },
                    { label: 'Verde Esmeralda', color: '#10b981' },
                    { label: 'Azul Soft', color: '#38bdf8' },
                    { label: 'Cyber Cyan', color: '#00f2fe' }
                  ].map((item) => (
                    <button
                      key={item.color}
                      onClick={() => handleThemeColor(item.color)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        background: item.color,
                        color: '#000',
                        fontWeight: 800,
                        border: config.theme.accentColor === item.color ? '3px solid #fff' : 'none',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <hr style={{ borderColor: 'var(--border-card)' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label className="form-label">Backup e Exportação</label>
                
                <button className="btn-primary" onClick={handleExportJSON} style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-main)', boxShadow: 'none' }}>
                  <Download size={18} />
                  <span>Exportar Configuração JSON</span>
                </button>

                <label className="btn-primary" style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-main)', boxShadow: 'none', cursor: 'pointer' }}>
                  <Upload size={18} />
                  <span>Importar Arquivo JSON</span>
                  <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
                </label>

                <button className="btn-primary" onClick={onResetDefault} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', boxShadow: 'none' }}>
                  <RotateCcw size={18} />
                  <span>Restaurar Configuração Padrão</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
