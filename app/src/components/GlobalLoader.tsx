import React from 'react';

interface GlobalLoaderProps {
  fullScreen?: boolean;
}

export default function GlobalLoader({ fullScreen = false }: GlobalLoaderProps) {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin shadow-lg"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-2 h-2 bg-primary-dark rounded-full animate-pulse"></span>
        </div>
      </div>
      <p className="text-sm font-black text-primary tracking-widest uppercase opacity-80">
        Loading
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-main/90 backdrop-blur-md">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
      {loaderContent}
    </div>
  );
}
