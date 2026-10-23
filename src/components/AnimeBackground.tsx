import React, { useEffect, useRef } from 'react';

export type ThemeMode = 'dark' | 'light' | 'anime' | 'natural';

interface AnimeBackgroundProps {
  theme: ThemeMode;
  enabled?: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  fadeSpeed: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  type: 'star' | 'petal' | 'ember' | 'firefly';
}

export const AnimeBackground: React.FC<AnimeBackgroundProps> = ({
  theme,
  enabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color palettes based on theme
    const getPalette = () => {
      switch (theme) {
        case 'light':
          return [
            'rgba(244, 114, 182, 0.45)', // pink sakura
            'rgba(167, 139, 250, 0.4)', // purple
            'rgba(56, 189, 248, 0.4)',  // sky
            'rgba(251, 191, 36, 0.35)', // gold
          ];
        case 'anime':
          return [
            'rgba(236, 72, 153, 0.75)', // vivid pink
            'rgba(168, 85, 247, 0.75)', // neon violet
            'rgba(34, 211, 238, 0.75)', // cyan
            'rgba(251, 146, 60, 0.65)', // anime twilight ember
          ];
        case 'natural':
          return [
            'rgba(52, 211, 153, 0.55)', // emerald
            'rgba(45, 212, 191, 0.55)', // teal
            'rgba(96, 165, 250, 0.45)', // blue
            'rgba(234, 179, 8, 0.45)',  // firefly yellow
          ];
        case 'dark':
        default:
          return [
            'rgba(34, 211, 238, 0.6)',  // cyber cyan
            'rgba(147, 51, 234, 0.6)',  // cyber purple
            'rgba(244, 63, 94, 0.45)',  // cyber rose
            'rgba(255, 255, 255, 0.7)', // bright white star
          ];
      }
    };

    const palette = getPalette();
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const typeChoice: Particle['type'] =
        theme === 'anime' || theme === 'light'
          ? Math.random() > 0.4 ? 'petal' : 'star'
          : theme === 'natural'
          ? Math.random() > 0.5 ? 'firefly' : 'star'
          : Math.random() > 0.3 ? 'star' : 'ember';

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: typeChoice === 'petal' ? Math.random() * 6 + 4 : Math.random() * 2.5 + 1,
        speedX: (Math.random() - 0.4) * (typeChoice === 'petal' ? 1.2 : 0.4),
        speedY: typeChoice === 'petal' ? Math.random() * 0.9 + 0.4 : (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        fadeSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        color: palette[Math.floor(Math.random() * palette.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        type: typeChoice,
      });
    }

    // Shooting stars state
    let shootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      opacity: 0,
      active: false,
    };

    const triggerShootingStar = () => {
      shootingStar.x = Math.random() * (width * 0.8);
      shootingStar.y = Math.random() * (height * 0.4);
      shootingStar.length = Math.random() * 120 + 80;
      shootingStar.speed = Math.random() * 10 + 12;
      shootingStar.opacity = 0.9;
      shootingStar.active = true;
    };

    let shootingStarTimer = 0;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render shooting star if active
      shootingStarTimer++;
      if (shootingStarTimer > 280 && Math.random() > 0.6) {
        shootingStarTimer = 0;
        triggerShootingStar();
      }

      if (shootingStar.active) {
        const gradient = ctx.createLinearGradient(
          shootingStar.x,
          shootingStar.y,
          shootingStar.x - shootingStar.length,
          shootingStar.y - shootingStar.length * 0.4
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
        gradient.addColorStop(0.3, `rgba(34, 211, 238, ${shootingStar.opacity * 0.6})`);
        gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - shootingStar.length,
          shootingStar.y - shootingStar.length * 0.4
        );
        ctx.stroke();

        shootingStar.x += shootingStar.speed;
        shootingStar.y += shootingStar.speed * 0.4;
        shootingStar.opacity -= 0.015;

        if (shootingStar.opacity <= 0 || shootingStar.x > width || shootingStar.y > height) {
          shootingStar.active = false;
        }
      }

      // Draw all particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Animate
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.fadeSpeed;
        p.rotation += p.rotationSpeed;

        if (p.opacity > 0.85 || p.opacity < 0.15) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        // Wrap around boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.y < -20) p.y = height + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));

        if (p.type === 'petal') {
          // Anime Sakura Petal shape
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 1.6, 0.4, 0, Math.PI * 2);
          ctx.fill();

          // Subtle petal highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.beginPath();
          ctx.arc(-p.size * 0.2, -p.size * 0.3, p.size * 0.35, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'firefly') {
          // Glowing firefly
          const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2.5);
          glow.addColorStop(0, p.color);
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Glowing star / cyber ember
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic ambient gradient backdrop */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          theme === 'light'
            ? 'bg-gradient-to-b from-slate-100 via-rose-50/40 to-slate-200'
            : theme === 'anime'
            ? 'bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950'
            : theme === 'natural'
            ? 'bg-gradient-to-b from-emerald-950 via-teal-950 to-slate-950'
            : 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950'
        }`}
      />

      {/* Cyber-anime grid horizon mesh for anime/dark modes */}
      {(theme === 'anime' || theme === 'dark') && (
        <div
          className="absolute inset-x-0 bottom-0 h-96 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(34, 211, 238, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.25) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            transform: 'perspective(450px) rotateX(65deg)',
            transformOrigin: 'bottom center',
          }}
        />
      )}

      {/* Glowing atmospheric orbs */}
      <div
        className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] transition-all duration-700 ${
          theme === 'light'
            ? 'bg-pink-300/25'
            : theme === 'anime'
            ? 'bg-pink-600/25'
            : theme === 'natural'
            ? 'bg-emerald-500/20'
            : 'bg-cyan-500/15'
        }`}
      />
      <div
        className={`absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full blur-[140px] transition-all duration-700 ${
          theme === 'light'
            ? 'bg-cyan-200/25'
            : theme === 'anime'
            ? 'bg-purple-600/25'
            : theme === 'natural'
            ? 'bg-teal-500/20'
            : 'bg-purple-600/15'
        }`}
      />

      {/* Interactive canvas layer for floating petals and stars */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
