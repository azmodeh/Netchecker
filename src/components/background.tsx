
"use client";

import React, { useEffect, useState } from 'react';

const Background = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const sparkles = Array.from({ length: 40 }).map((_, i) => {
    const size = Math.random() * 2 + 1;
    const style = {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${size}px`,
      height: `${size}px`,
      animationDelay: `${Math.random() * 7}s`,
      animationDuration: `${Math.random() * 5 + 5}s`,
    };
    return <div key={i} className="absolute rounded-full bg-white/80 animate-sparkle" style={style} />;
  });

  return (
    <div className="fixed top-0 left-0 w-full h-screen -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-move-gradient"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, hsl(var(--primary) / 0.15), transparent 25%),
            radial-gradient(circle at 80% 30%, hsl(var(--accent) / 0.15), transparent 25%),
            radial-gradient(circle at 50% 70%, hsl(var(--primary) / 0.1), transparent 30%)
          `,
        }}
      />
      {sparkles}
    </div>
  );
};

export default Background;
