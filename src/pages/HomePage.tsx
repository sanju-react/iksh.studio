import React from 'react';
import { Hero } from '../sections/Hero';
import { HeroShowreel } from '../sections/HeroShowreel';
import { IntroManifesto } from '../sections/IntroManifesto';
import { ServicesRows } from '../sections/ServicesRows';
import { HorizontalWork } from '../sections/HorizontalWork';
import { BrandingShowcase } from '../sections/BrandingShowcase';
import { AboutStudio } from '../sections/AboutStudio';
import { ProcessTimeline } from '../sections/ProcessTimeline';
import { DualMarquee } from '../sections/DualMarquee';
import { Testimonials } from '../sections/Testimonials';
import { FinalCTA } from '../sections/FinalCTA';
import { ProjectItem, PageView } from '../types';

interface HomePageProps {
  isAppLoaded?: boolean;
  onNavigate: (page: PageView) => void;
  onSelectProject: (project: ProjectItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  isAppLoaded = true,
  onNavigate,
  onSelectProject,
}) => {
  return (
    <main className="relative z-10">
      <Hero
        isAppLoaded={isAppLoaded}
        onExploreWork={() => {
          const el = document.getElementById('work-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onContact={() => onNavigate('contact')}
      />

      <HeroShowreel />

      <IntroManifesto />

      <div id="work-section">
        <HorizontalWork
          onSelectProject={onSelectProject}
          onViewAllWork={() => onNavigate('work')}
        />
      </div>

      <ServicesRows
        onSelectService={() => onNavigate('services')}
      />

      <DualMarquee />

      <BrandingShowcase />

      <AboutStudio />

      <ProcessTimeline />

      <Testimonials />

      <FinalCTA onStartProject={() => onNavigate('contact')} />
    </main>
  );
};
