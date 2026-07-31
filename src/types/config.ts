export interface ProfileStats {
  id: string;
  value: string;
  label: string;
}

export interface ProfileConfig {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  isVerified: boolean;
  openSpotsBadge: string;
  whatsappNumber: string;
  stats: ProfileStats[];
}

export interface SocialLinksConfig {
  instagram?: string;
  whatsapp?: string;
  youtube?: string;
  tiktok?: string;
  email?: string;
}

export type LinkType = 
  | 'whatsapp'
  | 'modal_plans'
  | 'modal_testimonials'
  | 'modal_macro'
  | 'modal_ebook'
  | 'external';

export type LinkBadgeColor = 'emerald' | 'amber' | 'rose' | 'cyan' | 'purple';

export interface LinkItem {
  id: string;
  title: string;
  subtitle?: string;
  iconName: string;
  badge?: string;
  badgeColor?: LinkBadgeColor;
  type: LinkType;
  url?: string;
  whatsappMsg?: string;
  featured?: boolean;
  animation?: 'pulse' | 'glow' | 'bounce' | 'none';
}

export interface PlanItem {
  id: string;
  title: string;
  tagline: string;
  price: string;
  period: string;
  originalPrice?: string;
  featured: boolean;
  badge?: string;
  features: string[];
  whatsappMsg: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientInfo: string;
  result: string;
  comment: string;
  beforeAfterImg: string;
  stars: number;
}

export interface EbookItem {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  badge?: string;
  authorCredit?: string;
}

export interface BioLinkConfig {
  profile: ProfileConfig;
  socials: SocialLinksConfig;
  links: LinkItem[];
  plans: PlanItem[];
  testimonials?: TestimonialItem[];
  ebooks?: EbookItem[];
  theme: {
    accentColor: string;
    secondaryAccent: string;
    bgStyle: 'dark-onyx' | 'cyber-dark' | 'midnight-blue';
  };
}
