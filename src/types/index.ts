export type NavItem = {
  label: string;
  href: string;
  page?: 'home' | 'work' | 'services' | 'about' | 'contact';
};

export type ServiceItem = {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  deliverables: string[];
  image: string;
  tag: string;
};

export type ProjectItem = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  client: string;
  year: string;
  role: string;
  duration: string;
  heroImage: string;
  galleryImages: string[];
  overview: string;
  challenge: string;
  solution: string;
  impact: {
    stat: string;
    label: string;
  }[];
  palette: string[];
  tags: string[];
  link?: string;
  featured?: boolean;
};

export type ProcessStep = {
  number: string;
  title: string;
  phase: string;
  duration: string;
  description: string;
  keyActivities: string[];
};

export type TestimonialItem = {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  project: string;
  avatar: string;
  metrics?: string;
};

export type PageView = 'home' | 'work' | 'services' | 'about' | 'contact';

export type CursorType = 'default' | 'pointer' | 'project' | 'cta' | 'drag' | 'explore' | 'close';
