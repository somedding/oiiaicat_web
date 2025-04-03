"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [isPressed, setIsPressed] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(90);
  const animationRef = useRef<number | undefined>(undefined);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/oiiaicat.mp3');
    audioRef.current.loop = true;
  }, []);

  const updateFrame = () => {
    setCurrentFrame(prev => {
      if (prev >= 150) return 90;
      return prev + 1;
    });
  };

  useEffect(() => {
    if (isPressed) {
      const frameInterval = 1000 / 30;
      const animate = () => {
        updateFrame();
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPressed]);

  const handleMouseDown = () => {
    setIsPressed(true);
    audioRef.current?.play();
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    audioRef.current?.pause();
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setCurrentFrame(90);
  };

  const imagePath = isPressed 
    ? `/oiiaicat/unscreen-${currentFrame.toString().padStart(3, '0')}.png`
    : '/oiiaicat.png';

  return (
    <main className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-300 ${isPressed ? 'animate-rainbow-bg scale-105' : 'bg-green-500'}`}>
      {isPressed && (
        <>
          {/* 레이저쇼 효과 */}
          <div className="laser-container">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="laser-beam" />
            ))}
          </div>

          {/* 연기 효과 */}
          <div className="smoke-container">
            <div className="smoke" />
            <div className="smoke" />
            <div className="smoke" />
          </div>

          {/* 중앙 빛나는 효과 */}
          <div className="center-glow" />
        </>
      )}
      
      <div 
        className={`relative cursor-pointer transition-transform duration-300 ${isPressed ? 'scale-110' : 'hover:scale-105'}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        <div className="relative">
          <Image
            src={imagePath}
            alt="OIIAI Cat"
            width={200}
            height={200}
            priority
            className="relative z-10"
          />
        </div>
      </div>
    </main>
  );
}
