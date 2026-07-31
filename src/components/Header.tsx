import React from 'react';
import { ProfileConfig } from '../types/config';
import { FaShieldHalved as ShieldCheck, FaFire as Flame } from 'react-icons/fa6';

interface HeaderProps {
  profile: ProfileConfig;
}

export const Header: React.FC<HeaderProps> = ({ profile }) => {
  return (
    <header className="header-container">
      {/* Avatar Container */}
      <div className="avatar-wrapper">
        <img
          src={profile.avatarUrl}
          alt={profile.name}
          className="avatar-img"
          loading="eager"
        />
        {profile.isVerified && (
          <div className="verified-badge" title="Perfil Verificado">
            <ShieldCheck size={14} />
          </div>
        )}
      </div>

      {/* Urgency Badge */}
      {profile.openSpotsBadge && (
        <div className="spots-badge">
          <Flame size={14} />
          <span>{profile.openSpotsBadge}</span>
        </div>
      )}

      {/* Name and Title */}
      <h1 className="trainer-name">{profile.name}</h1>
      <p className="trainer-title">{profile.title}</p>
      
      {/* Bio */}
      <p className="trainer-bio">{profile.bio}</p>

      {/* Impact Stats Grid */}
      {profile.stats && profile.stats.length > 0 && (
        <div className="stats-grid">
          {profile.stats.map((stat) => (
            <div key={stat.id} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      )}
    </header>
  );
};
