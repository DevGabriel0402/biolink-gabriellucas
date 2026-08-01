import React from 'react';
import { LinkItem } from '../types/config';
import { 
  FaFire as Flame, 
  FaTrophy as Trophy, 
  FaCalculator as Calculator, 
  FaBookOpen as BookOpen, 
  FaWhatsapp as MessageCircle, 
  FaDumbbell as Dumbbell, 
  FaBolt as Zap, 
  FaChevronRight as ChevronRight,
  FaBullseye as Target,
  FaTag as Tag
} from 'react-icons/fa6';
import { HiSparkles as Sparkles } from 'react-icons/hi2';
import { FiExternalLink as ExternalLink } from 'react-icons/fi';

interface LinkCardProps {
  link: LinkItem;
  onClick: (link: LinkItem) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({ link, onClick }) => {
  // Map icon name dynamically
  const renderIcon = (iconName: string) => {
    const props = { size: 22 };
    switch (iconName) {
      case 'Flame': return <Flame {...props} />;
      case 'Trophy': return <Trophy {...props} />;
      case 'Calculator': return <Calculator {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'MessageCircle': return <MessageCircle {...props} />;
      case 'Dumbbell': return <Dumbbell {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Target': return <Target {...props} />;
      case 'Tag': return <Tag {...props} />;
      default: return <ExternalLink {...props} />;
    }
  };

  const animClass = link.animation === 'glow' 
    ? 'anim-glow' 
    : link.animation === 'pulse' 
    ? 'anim-pulse' 
    : '';

  return (
    <div
      className={`link-card ${link.featured ? 'featured' : ''} ${animClass}`}
      onClick={() => onClick(link)}
      role="button"
      tabIndex={0}
      aria-label={`${link.title}${link.subtitle ? `. ${link.subtitle}` : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(link);
        }
      }}
    >
      {/* Badge tag if specified */}
      {link.badge && (
        <span className={`card-badge ${link.badgeColor || 'amber'}`}>
          {link.badge}
        </span>
      )}

      <div className="link-content">
        <div className="link-icon-box">
          {renderIcon(link.iconName)}
        </div>
        <div className="link-text-box">
          <span className="link-title">{link.title}</span>
          {link.subtitle && (
            <span className="link-subtitle">{link.subtitle}</span>
          )}
        </div>
      </div>

      <ChevronRight size={18} className="chevron-icon" />
    </div>
  );
};
