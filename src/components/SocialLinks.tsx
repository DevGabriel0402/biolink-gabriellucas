import React from 'react';
import { SocialLinksConfig } from '../types/config';
import { FaInstagram as Instagram, FaWhatsapp as Phone, FaEnvelope as Mail } from 'react-icons/fa6';

interface SocialLinksProps {
  socials: SocialLinksConfig;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ socials }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      margin: '6px 0 10px',
    }}>
      {socials.instagram && (
        <a
          href={socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram"
          style={socialIconStyle}
        >
          <Instagram size={20} />
        </a>
      )}

      {socials.whatsapp && (
        <a
          href={socials.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          title="WhatsApp Direct"
          style={socialIconStyle}
        >
          <Phone size={20} />
        </a>
      )}


      {socials.email && (
        <a
          href={`mailto:${socials.email}`}
          title="Enviar E-mail"
          style={socialIconStyle}
        >
          <Mail size={20} />
        </a>
      )}
    </div>
  );
};

const socialIconStyle: React.CSSProperties = {
  width: '42px',
  height: '42px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'var(--text-main)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  textDecoration: 'none'
};
