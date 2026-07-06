'use client';

import React from 'react';

const Star = ({ style }: { style: React.CSSProperties }) => (
  <svg className="sparkle-star" style={style} viewBox="0 0 24 24" fill="#C2A86F">
    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
  </svg>
);

const Dot = ({ style }: { style: React.CSSProperties }) => (
  <div
    className="sparkle-star"
    style={{
      width: style.width || 6,
      height: style.height || 6,
      borderRadius: '50%',
      background: '#C2A86F',
      ...style,
    }}
  />
);

export default function SparkleDecor() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <Star style={{ top: '6%', right: '10%', width: 22, height: 22, animationDelay: '0s' }} />
      <Star style={{ top: '14%', left: '7%', width: 14, height: 14, animationDelay: '0.6s' }} />
      <Star style={{ top: '38%', right: '22%', width: 18, height: 18, animationDelay: '1.2s' }} />
      <Star style={{ bottom: '18%', left: '5%', width: 18, height: 18, animationDelay: '1.8s' }} />
      <Star style={{ bottom: '8%', right: '6%', width: 14, height: 14, animationDelay: '0.9s' }} />
      <Star style={{ top: '55%', left: '18%', width: 10, height: 10, animationDelay: '2.4s' }} />

      <Dot style={{ top: '10%', left: '14%', width: 7, height: 7, opacity: 0.3, animationDelay: '0.3s' }} />
      <Dot style={{ top: '22%', right: '28%', width: 5, height: 5, opacity: 0.2, animationDelay: '1.5s' }} />
      <Dot style={{ bottom: '28%', left: '32%', width: 7, height: 7, opacity: 0.25, animationDelay: '0.7s' }} />
      <Dot style={{ top: '65%', right: '14%', width: 5, height: 5, opacity: 0.2, animationDelay: '2s' }} />
      <Dot style={{ bottom: '12%', left: '42%', width: 5, height: 5, opacity: 0.15, animationDelay: '2.6s' }} />
      <Dot style={{ top: '4%', left: '48%', width: 5, height: 5, opacity: 0.2, animationDelay: '1.8s' }} />
      <Dot style={{ bottom: '38%', right: '4%', width: 5, height: 5, opacity: 0.15, animationDelay: '3s' }} />
    </div>
  );
}
