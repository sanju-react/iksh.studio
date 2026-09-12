import { useState, useEffect } from 'react';
import { PageView, ProjectItem } from './types';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { CustomCursor } from './components/common/CustomCursor';
import { Preloader } from './components/common/Preloader';
import { NoiseOverlay } from './components/common/NoiseOverlay';
import { AmbientOrb } from './components/interactive/AmbientOrb';
import { ProjectModal } from './components/common/ProjectModal';
import { GlobalToast } from './components/common/GlobalToast';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { WorkPage } from './pages/WorkPage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollTo } = useSmoothScroll(isLoaded);

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    scrollTo(0, { duration: 0.8 });
    const targetPath = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState({ page }, '', targetPath);
    }
  };

  // Sync clean pathname routing and handle browser back/forward buttons
  useEffect(() => {
    const syncRouteFromLocation = () => {
      // Clean any legacy hash from URL
      if (window.location.hash) {
        const hashPage = window.location.hash.replace('#', '').toLowerCase();
        if (['home', 'work', 'services', 'about', 'contact'].includes(hashPage)) {
          setCurrentPage(hashPage as PageView);
          const targetPath = hashPage === 'home' ? '/' : `/${hashPage}`;
          window.history.replaceState({ page: hashPage }, '', targetPath);
          return;
        }
        window.history.replaceState(null, '', window.location.pathname);
      }

      const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase() as PageView;
      if (['work', 'services', 'about', 'contact'].includes(path)) {
        setCurrentPage(path);
      } else {
        setCurrentPage('home');
      }
    };

    syncRouteFromLocation();
    window.addEventListener('popstate', syncRouteFromLocation);
    return () => window.removeEventListener('popstate', syncRouteFromLocation);
  }, []);

  const handleScrollToTop = () => {
    scrollTo(0, { duration: 1.2 });
  };

  return (
    <div className="relative min-h-screen bg-forest-900 text-ivory-200 overflow-x-hidden">
      {/* Film Grain Texture Overlay */}
      <NoiseOverlay />

      {/* Atmospheric Ambient Glows */}
      <AmbientOrb />

      {/* Context-Aware Magnetic Custom Cursor (Desktop Only) */}
      <CustomCursor />

      {/* Luxury Studio Preloader */}
      {!isLoaded && <Preloader onComplete={() => setIsLoaded(true)} />}

      {/* Fixed Dynamic Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Dynamic View Page Routing */}
      <div className="relative z-10 transition-opacity duration-500">
        {currentPage === 'home' && (
          <HomePage
            isAppLoaded={isLoaded}
            onNavigate={handleNavigate}
            onSelectProject={(proj) => setSelectedProject(proj)}
          />
        )}

        {currentPage === 'work' && (
          <WorkPage
            onSelectProject={(proj) => setSelectedProject(proj)}
            onContact={() => handleNavigate('contact')}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            onContact={() => handleNavigate('contact')}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onContact={() => handleNavigate('contact')}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage />
        )}
      </div>

      {/* Global Project Case Study Modal Drawer */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInquire={() => {
          setSelectedProject(null);
          handleNavigate('contact');
        }}
      />

      {/* Global Luxury Toast Notification for Emails & Copy Actions */}
      <GlobalToast />

      {/* Studio Luxury Footer */}
      <Footer
        onNavigate={handleNavigate}
        onScrollToTop={handleScrollToTop}
      />
    </div>
  );
}

export default App;
