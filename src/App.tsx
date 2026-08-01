import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BioLinkConfig, LinkItem } from './types/config';
import { defaultConfig } from './data/defaultConfig';
import { Header } from './components/Header';
import { SocialLinks } from './components/SocialLinks';
import { LinkCard } from './components/LinkCard';
import { FiSettings as Settings } from 'react-icons/fi';
import { FaShieldHalved as ShieldCheck } from 'react-icons/fa6';

const PlanComparison = lazy(() => import('./components/PlanComparison').then((module) => ({ default: module.PlanComparison })));
const TestimonialModal = lazy(() => import('./components/TestimonialModal').then((module) => ({ default: module.TestimonialModal })));
const MacroCalculator = lazy(() => import('./components/MacroCalculator').then((module) => ({ default: module.MacroCalculator })));
const LeadMagnetModal = lazy(() => import('./components/LeadMagnetModal').then((module) => ({ default: module.LeadMagnetModal })));
const PratiqueModal = lazy(() => import('./components/PratiqueModal').then((module) => ({ default: module.PratiqueModal })));
const EditorModal = lazy(() => import('./components/EditorModal').then((module) => ({ default: module.EditorModal })));

const ModalLoading = () => (
  <div className="modal-overlay" role="status" aria-live="polite">
    <div className="modal-loading-card"><span className="modal-loading-spinner" /><strong>Preparando ferramenta...</strong></div>
  </div>
);

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
          parsed.profile.title = defaultConfig.profile.title;
          parsed.profile.bio = defaultConfig.profile.bio;
          parsed.profile.whatsappNumber = "5531991660594";
          parsed.profile.stats = defaultConfig.profile.stats;
        }

        if (parsed.links) {
          parsed.links = parsed.links.filter((l: any) => l.id !== 'link-testimonials' && l.type !== 'modal_testimonials');
          const hasPratique = parsed.links.some((l: any) => l.type === 'modal_pratique');
          if (!hasPratique) {
            parsed.links.splice(1, 0, {
              id: "link-pratique-discount",
              title: "🎁 DESCONTO 1ª PARCELA PRATIQUE FITNESS",
              subtitle: "Venha pegar seu desconto na primeira parcela em qualquer unidade da Pratique Fitness",
              iconName: "Tag",
              badge: "CUPOM EXCLUSIVO",
              badgeColor: "red",
              type: "modal_pratique",
              featured: true,
              animation: "pulse"
            });
          }
          parsed.links.forEach((l: any) => {
            if (l.id === 'link-plans' || l.type === 'modal_plans') {
              l.title = "🔥 CONSULTORIA ONLINE";
            }
            if (l.type === 'modal_pratique') {
              l.title = "🎁 Faça sua Matrícula na Pratique e Ganhe o Saver Club";
              l.subtitle = "Isenção de R$ 99,90 na taxa de matrícula + Saver Club (Válido a partir do Plano Plus)";
              l.badge = "VÁLIDO NO PLANO PLUS";
            }
            if (l.type === 'modal_macro') {
              l.title = "⚡ CENTRAL FITNESS & AVALIAÇÃO COMPLETA";
              l.subtitle = "Avaliação, calorias, macros, água, corrida, cargas e cartão para Stories";
              l.badge = "5 FERRAMENTAS GRÁTIS";
            }
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
  const [isPratiqueOpen, setIsPratiqueOpen] = useState(false);
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
      case 'modal_pratique':
        setIsPratiqueOpen(true);
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
        <section className="bio-profile-panel">
          <Header profile={config.profile} />
          <SocialLinks socials={config.socials} />
          <div className="bio-profile-note">
            <ShieldCheck size={16} />
            <span>Orientação clara, ferramentas gratuitas e acompanhamento próximo.</span>
          </div>
        </section>

        <section className="bio-actions-panel">
          <div className="bio-actions-heading">
            <span>Comece por aqui</span>
            <h2>Escolha o próximo passo para o seu objetivo</h2>
            <p>Avalie seu momento, encontre uma academia ou conheça a consultoria.</p>
          </div>

          <div className="bio-links-list">
            {config.links.map((link) => (
              <LinkCard key={link.id} link={link} onClick={handleLinkClick} />
            ))}
          </div>

          <footer className="bio-footer">
            <div><ShieldCheck size={14} color="var(--color-accent)" /><span>Consultoria VIP • Todos os direitos reservados</span></div>
            <p>BioLink oficial de @ogabriielvieira</p>
          </footer>
        </section>
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
      <Suspense fallback={<ModalLoading />}>
        {isPlansOpen && <PlanComparison isOpen onClose={() => setIsPlansOpen(false)} plans={config.plans} whatsappNumber={config.profile.whatsappNumber} />}
        {isTestimonialsOpen && <TestimonialModal isOpen onClose={() => setIsTestimonialsOpen(false)} testimonials={config.testimonials || []} whatsappNumber={config.profile.whatsappNumber} />}
        {isMacroOpen && <MacroCalculator isOpen onClose={() => setIsMacroOpen(false)} whatsappNumber={config.profile.whatsappNumber} />}
        {isEbookOpen && <LeadMagnetModal isOpen onClose={() => setIsEbookOpen(false)} whatsappNumber={config.profile.whatsappNumber} ebooks={config.ebooks} />}
        {isPratiqueOpen && <PratiqueModal isOpen onClose={() => setIsPratiqueOpen(false)} />}
        {isEditorOpen && <EditorModal isOpen onClose={handleCloseEditor} config={config} onChangeConfig={setConfig} onResetDefault={handleResetDefault} />}
      </Suspense>
    </div>
  );
};
