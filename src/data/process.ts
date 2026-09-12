import { ProcessStep } from '../types';

export const processData: ProcessStep[] = [
  {
    number: '01',
    title: 'DISCOVER',
    phase: 'Immersion & Category Audit',
    duration: 'Week 1',
    description: 'We immerse ourselves into your brand origin, competitive whitespace, customer psychology, and business economics. We uncover the friction holding you back and pinpoint the undeniable core truth.',
    keyActivities: [
      'Executive Stakeholder Interviews',
      'Competitor & Cultural Semiotics Audit',
      'Audience Persona & Sentiment Mapping',
      'Technical Feasibility Assessment'
    ]
  },
  {
    number: '02',
    title: 'DEFINE',
    phase: 'Strategic Core & Architecture',
    duration: 'Week 2',
    description: 'Before aesthetic exploration, we formalize the brand positioning, value proposition, tone of voice, narrative hierarchy, and architectural blueprint.',
    keyActivities: [
      'Brand North Star & Positioning Manifesto',
      'Verbal Identity & Editorial Tone of Voice',
      'Information Architecture & UX Wireframes',
      'Art Direction Moodboards & Visual Vectors'
    ]
  },
  {
    number: '03',
    title: 'DESIGN',
    phase: 'Haute Visual Craft & Systems',
    duration: 'Weeks 3 - 5',
    description: 'We explore radical visual directions, refining typography, layout systems, 3D assets, color palettes, and motion choreography into a cohesive, high-art ecosystem.',
    keyActivities: [
      'Visual Identity & Logo Engineering',
      'High-Fidelity Interactive Prototypes',
      'Motion Design & Micro-interaction Studies',
      'Design Token System & Guidelines'
    ]
  },
  {
    number: '04',
    title: 'BUILD',
    phase: 'Clean Engineering & Performance',
    duration: 'Weeks 6 - 8',
    description: 'We bring the design to life with modern React, TypeScript, GSAP animation engines, and headless CMS integrations. Zero bloat, silky 60fps scrolling, and sub-second load times.',
    keyActivities: [
      'Component Architecture & State Engine',
      'GSAP Timeline & ScrollTrigger Sync',
      'Responsive Stress Testing Across 12+ Devices',
      'Accessibility (WCAG 2.1 AA) & SEO Structured Data'
    ]
  },
  {
    number: '05',
    title: 'LAUNCH',
    phase: 'Flawless Debut & Quality Assurance',
    duration: 'Week 9',
    description: 'We orchestrate a high-impact launch sequence, conducting rigorous security sweeps, browser matrix testing, CDN optimizations, and analytics instrumentation.',
    keyActivities: [
      'End-to-End Cross-Browser Validation',
      'Core Web Vitals Audit (100 Score Target)',
      'Custom Analytics & Event Telemetry',
      'Client Handoff Training & Asset Vault'
    ]
  },
  {
    number: '06',
    title: 'GROW',
    phase: 'Iterative Velocity & Scale',
    duration: 'Ongoing',
    description: 'A launch is merely the beginning. We partner long-term to execute performance marketing, organic creative loops, ongoing conversion optimization, and brand evolution.',
    keyActivities: [
      'Conversion Rate Optimization (A/B Testing)',
      'Multi-Channel Growth Creative Systems',
      'Continuous Feature Evolution',
      'Quarterly Category Leadership Reviews'
    ]
  }
];
