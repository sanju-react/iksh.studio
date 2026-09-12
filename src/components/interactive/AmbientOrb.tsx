import React from 'react';

export const AmbientOrb: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Top right emerald ambient orb */}
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-20 blur-[130px] transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, #2FE69E 0%, #08251D 65%, transparent 80%)',
        }}
      />

      {/* Center left dark sage aura */}
      <div
        className="absolute top-1/3 -left-48 w-[700px] h-[700px] rounded-full opacity-15 blur-[150px]"
        style={{
          background: 'radial-gradient(circle, #175443 0%, #071C17 70%, transparent 80%)',
        }}
      />

      {/* Bottom right gold accent aura */}
      <div
        className="absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full opacity-10 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #D8C39E 0%, #08251D 60%, transparent 80%)',
        }}
      />
    </div>
  );
};
