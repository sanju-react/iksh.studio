import React, { useState } from 'react';
import { MagneticButton } from '../common/MagneticButton';
import { Check, Clock, ArrowRight } from 'lucide-react';

interface ProjectEstimatorProps {
  onProceedToInquiry?: (data: { services: string[]; timeline: string; estimatedBudget: string }) => void;
}

export const ProjectEstimator: React.FC<ProjectEstimatorProps> = ({ onProceedToInquiry }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(['Branding', 'Website Design & Dev']);
  const [timeline, setTimeline] = useState<string>('standard');

  const servicesList = [
    { id: 'Branding', name: 'Brand Identity & Guidelines', basePrice: 4500, weeks: 4 },
    { id: 'Website Design & Dev', name: 'Interactive Custom Web Flagship', basePrice: 7500, weeks: 6 },
    { id: 'Digital Marketing', name: 'Performance Growth System', basePrice: 3500, weeks: 4 },
    { id: 'Graphic Design', name: 'Packaging & Editorial Suite', basePrice: 3000, weeks: 3 },
    { id: 'Creative Strategy', name: 'Brand Positioning & Strategy', basePrice: 2500, weeks: 2 },
    { id: 'Social Media Design', name: 'Bespoke Social System & Motion', basePrice: 2800, weeks: 3 },
  ];

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const calculateEstimate = () => {
    let total = 0;
    let weeks = 0;

    servicesList.forEach((s) => {
      if (selectedServices.includes(s.id)) {
        total += s.basePrice;
        weeks += s.weeks * 0.7; // concurrent synergy discount
      }
    });

    if (timeline === 'rush') {
      total *= 1.25;
      weeks *= 0.65;
    }

    return {
      priceRange: total === 0 ? '$0' : `$${Math.round(total).toLocaleString()} — $${Math.round(total * 1.35).toLocaleString()}`,
      estimatedWeeks: total === 0 ? '0 Weeks' : `${Math.ceil(weeks)} - ${Math.ceil(weeks + 2)} Weeks`,
    };
  };

  const estimate = calculateEstimate();

  const handleStartInquiry = () => {
    if (onProceedToInquiry) {
      onProceedToInquiry({
        services: selectedServices,
        timeline,
        estimatedBudget: estimate.priceRange,
      });
    }
  };

  return (
    <div className="w-full bg-forest-850/80 border border-sage-300/15 rounded-2xl p-6 sm:p-8 md:p-12 text-ivory-200">
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-700/50 border border-sage-300/20 text-accent-emerald font-mono text-xs uppercase tracking-wider mb-4">
          Interactive Studio Scope Configurator
        </div>
        <h3 className="font-serif text-3xl sm:text-4xl text-white mb-3">
          Configure Your Project Architecture
        </h3>
        <p className="font-sans text-sm sm:text-base text-sage-300">
          Select the disciplines your brand requires. We will calculate estimated timeline trajectories and customized engineering paths.
        </p>
      </div>

      {/* Services Selection */}
      <div className="space-y-3 mb-8">
        <label className="font-mono text-xs text-sage-400 uppercase tracking-wider block">
          1. Select Disciplines ({selectedServices.length} Selected)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {servicesList.map((service) => {
            const isSelected = selectedServices.includes(service.id);
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => toggleService(service.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-300 flex items-start justify-between ${
                  isSelected
                    ? 'bg-forest-700/80 border-accent-emerald text-white shadow-[0_0_20px_rgba(47,230,158,0.15)]'
                    : 'bg-forest-900/60 border-sage-300/10 text-sage-300 hover:border-sage-300/30'
                }`}
              >
                <div>
                  <span className="font-serif text-base sm:text-lg block text-ivory-200">
                    {service.id}
                  </span>
                  <span className="font-mono text-[11px] text-sage-400 block mt-1">
                    {service.name}
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 transition-colors ${
                    isSelected
                      ? 'bg-accent-emerald border-accent-emerald text-forest-950'
                      : 'border-sage-400/40 text-transparent'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline Selection */}
      <div className="space-y-3 mb-10">
        <label className="font-mono text-xs text-sage-400 uppercase tracking-wider block">
          2. Desired Timeline
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
          <button
            type="button"
            onClick={() => setTimeline('standard')}
            className={`p-4 rounded-xl border text-left transition-all duration-300 flex items-center justify-between ${
              timeline === 'standard'
                ? 'bg-forest-700/80 border-ivory-200 text-white'
                : 'bg-forest-900/60 border-sage-300/10 text-sage-300'
            }`}
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-wider block text-ivory-200">
                Standard Studio Pace
              </span>
              <span className="text-xs text-sage-400">Comprehensive, deeply iterative</span>
            </div>
            <Clock className="w-4 h-4 text-sage-300" />
          </button>

          <button
            type="button"
            onClick={() => setTimeline('rush')}
            className={`p-4 rounded-xl border text-left transition-all duration-300 flex items-center justify-between ${
              timeline === 'rush'
                ? 'bg-forest-700/80 border-accent-gold text-accent-gold'
                : 'bg-forest-900/60 border-sage-300/10 text-sage-300'
            }`}
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-wider block">
                Priority Sprint (+25%)
              </span>
              <span className="text-xs text-sage-400">Dedicated daily team focus</span>
            </div>
          </button>
        </div>
      </div>

      {/* Output Summary Banner */}
      <div className="bg-forest-950 p-6 sm:p-8 rounded-xl border border-sage-300/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left w-full md:w-auto">
          <span className="font-mono text-xs text-sage-400 uppercase tracking-widest block">
            ESTIMATED INVESTMENT & TIMELINE
          </span>
          <div className="flex flex-wrap items-baseline gap-4 justify-center md:justify-start">
            <span className="font-serif text-3xl sm:text-4xl text-accent-emerald font-semibold">
              {estimate.priceRange}
            </span>
            <span className="font-mono text-sm text-sage-300">
              • approx. {estimate.estimatedWeeks}
            </span>
          </div>
        </div>

        <MagneticButton
          onClick={handleStartInquiry}
          variant="primary"
          className="w-full md:w-auto !py-4 !px-8"
        >
          <span>Kickstart This Scope</span>
          <ArrowRight className="w-4 h-4" />
        </MagneticButton>
      </div>
    </div>
  );
};
