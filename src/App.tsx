import React, { useState, useEffect } from 'react';
import { BioLinkConfig, LinkItem } from './types/config';
import { defaultConfig } from './data/defaultConfig';
import { Header } from './components/Header';
import { SocialLinks } from './components/SocialLinks';
import { LinkCard } from './components/LinkCard';
import { PlanComparison } from './components/PlanComparison';
import { TestimonialModal } from './components/TestimonialModal';
import { MacroCalculator } from './components/MacroCalculator';
import { LeadMagnetModal } from './components/LeadMagnetModal';
import { EditorModal } from './components/EditorModal';
import { FiSettings as Settings } from 'react-icons/fi';
import { FaShieldHalved as ShieldCheck, FaHeart as Heart } from 'react-icons/fa6';

export const App: React.FC = () => {
  // Load initial config from LocalStorage or default
  const [config, setConfig] = useState<BioLinkConfig>(() => {
    try {
      const saved = localStorage.getItem('biolink_pt_config');
      if (saved) {
        let jsonStr = saved.replace(/Coach Lucas/g, 'Consultor Gabriel').replace(/Coach Gabriel/g, 'Consultor Gabriel');
        const parsed = JSON.parse(jsonStr);

        // Update profile avatar, name and whatsapp number automatically
        if (parsed.profile) {
          parsed.profile.avatarUrl = defaultConfig.profile.avatarUrl;
          parsed.profile.name = "Gabriel Lucas";
          parsed.profile.whatsappNumber = "5531991660594";
          parsed.profile.stats = defaultConfig.profile.stats;
        }

        if (parsed.links) {
          parsed.links = parsed.links.filter((l: any) => l.id !== 'link-testimonials' && l.type !== 'modal_testimonials');
          parsed.links.forEach((l: any) => {
            if (l.subtitle) l.subtitle = l.subtitle.replace(/Coach Lucas/g, 'Consultor Gabriel').replace(/Coach Gabriel/g, 'Consultor Gabriel');
            if (l.whatsappMsg) l.whatsappMsg = l.whatsappMsg.replace(/Olá Lucas!/g, 'Olá Gabriel!').replace(/Lucas/g, 'Gabriel');
          });
        }

        if (parsed.plans) {
          parsed.plans.forEach((p: any) => {
            if (p.period) p.period = p.period.replace(' (Pagamento Manual)', '');
          });
        }

        localStorage.setItem('biolink_pt_config', JSON.stringify(parsed));
        return parsed;
      }
      return defaultConfig;
    } catch {
      return defaultConfig;
    }
  });

  // Modal active states
  const [isPlansOpen, setIsPlansOpen] = useState(false);
  const [isTestimonialsOpen, setIsTestimonialsOpen] = useState(false);
  const [isMacroOpen, setIsMacroOpen] = useState(false);
  const [isEbookOpen, setIsEbookOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Router listener for /editar path
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/editar' || path === '/editar/') {
        setIsEditorOpen(true);
      } else {
        setIsEditorOpen(false);
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  // Sync state to LocalStorage and update CSS variables
  useEffect(() => {
    try {
      localStorage.setItem('biolink_pt_config', JSON.stringify(config));
    } catch (e) {
      console.error("Erro ao salvar no localStorage", e);
    }

    if (config.theme?.accentColor) {
      document.documentElement.style.setProperty('--color-accent', config.theme.accentColor);
    }
  }, [config]);

  const handleOpenEditor = () => {
    window.history.pushState({}, '', '/editar');
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    window.history.pushState({}, '', '/');
    setIsEditorOpen(false);
  };

  // Handle link click based on type
  const handleLinkClick = (link: LinkItem) => {
    switch (link.type) {
      case 'modal_plans':
        setIsPlansOpen(true);
        break;
      case 'modal_testimonials':
        setIsTestimonialsOpen(true);
        break;
      case 'modal_macro':
        setIsMacroOpen(true);
        break;
      case 'modal_ebook':
        setIsEbookOpen(true);
        break;
      case 'whatsapp': {
        const cleanPhone = config.profile.whatsappNumber.replace(/\D/g, '');
        const msg = link.whatsappMsg
          ? encodeURIComponent(link.whatsappMsg)
          : encodeURIComponent("Olá Gabriel! Vi seu link no Instagram e gostaria de informações sobre a consultoria.");
        window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
        break;
      }
      case 'external':
        if (link.url) window.open(link.url, '_blank');
        break;
      default:
        break;
    }
  };

  const handleResetDefault = () => {
    if (window.confirm("Deseja mesmo restaurar a configuração inicial original?")) {
      setConfig(defaultConfig);
      localStorage.removeItem('biolink_pt_config');
    }
  };

  return (
    <div className="app-viewport">
      <main className="bio-card-wrapper">
        {/* Profile Header */}
        <Header profile={config.profile} />

        {/* Social Icons */}
        <SocialLinks socials={config.socials} />

        {/* Interactive Link Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {config.links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onClick={handleLinkClick}
            />
          ))}
        </div>

        {/* Footer */}
        <footer style={{
          marginTop: '20px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-muted)',
          fontSize: '0.775rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="var(--color-accent)" />
            <span>Consultoria VIP • Todos os Direitos Reservados</span>
          </div>
          <p style={{ opacity: 0.6 }}>
            BioLink Otimizada para Alta Conversão no Instagram
          </p>
        </footer>
      </main>

      {/* Top Banner on /editar Route Only */}
      {window.location.pathname.toLowerCase().startsWith('/editar') && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'rgba(212, 255, 0, 0.15)',
          borderBottom: '1px solid var(--color-accent)',
          backdropFilter: 'blur(10px)',
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'var(--color-accent)',
          zIndex: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <Settings size={16} />
          <span>Você está na Rota de Edição (/editar). Clique em "Salvar" para aplicar as mudanças na página principal (/).</span>
        </div>
      )}

      {/* Floating Live Editor Button ONLY visible on /editar route */}
      {window.location.pathname.toLowerCase().startsWith('/editar') && (
        <button
          className="editor-trigger-btn"
          onClick={handleOpenEditor}
          title="Abrir Painel de Edição (/editar)"
        >
          <Settings size={18} />
          <span>Abrir Painel de Edição</span>
        </button>
      )}

      {/* Interactive Modals */}
      <PlanComparison
        isOpen={isPlansOpen}
        onClose={() => setIsPlansOpen(false)}
        plans={config.plans}
        whatsappNumber={config.profile.whatsappNumber}
      />

      <TestimonialModal
        isOpen={isTestimonialsOpen}
        onClose={() => setIsTestimonialsOpen(false)}
        testimonials={config.testimonials || []}
        whatsappNumber={config.profile.whatsappNumber}
      />

      <MacroCalculator
        isOpen={isMacroOpen}
        onClose={() => setIsMacroOpen(false)}
        whatsappNumber={config.profile.whatsappNumber}
      />

      <LeadMagnetModal
        isOpen={isEbookOpen}
        onClose={() => setIsEbookOpen(false)}
        whatsappNumber={config.profile.whatsappNumber}
        ebooks={config.ebooks}
      />

      <EditorModal
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        config={config}
        onChangeConfig={setConfig}
        onResetDefault={handleResetDefault}
      />
    </div>
  );
};
