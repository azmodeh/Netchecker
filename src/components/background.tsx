
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

  const sparkles = Array.from({ length: 50 }).map((_, i) => {
    const size = Math.random() * 2 + 1;
    const style = {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${size}px`,
      height: `${size}px`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `3s`,
    };
    return <div key={i} className="fixed rounded-full bg-primary animate-sparkle z-0" style={style} />;
  });

  return (
    <div className="fixed top-0 left-0 w-full h-screen -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]"
      />
      {sparkles}
    </div>
  );
};

export default Background;
