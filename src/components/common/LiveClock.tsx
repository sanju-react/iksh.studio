import React, { useState, useEffect } from 'react';

interface LiveClockProps {
  className?: string;
  showLocation?: boolean;
}

export const LiveClock: React.FC<LiveClockProps> = ({
  className = '',
  showLocation = true,
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setTime(new Intl.DateTimeFormat('en-US', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`inline-flex items-center gap-1.5 font-mono text-[11px] text-sage-300 tracking-wider ${className}`}>
      {showLocation && <span>SURAT, IN (IST) — </span>}
      <span className="tabular-nums font-medium text-ivory-200">{time || '12:00:00 PM'}</span>
    </div>
  );
};
