import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Activity } from 'lucide-react';

export function SplashScreen() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    const showTimer = setTimeout(() => setVisible(true), 100);

    // Navigate after splash
    const navTimer = setTimeout(() => {
      navigate({ to: '/input' });
    }, 2800);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 gradient-splash flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url(/assets/generated/splash-bg.dim_1080x1920.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Content */}
      <div className={`relative z-10 flex flex-col items-center gap-6 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Logo */}
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-white/20 blur-xl scale-110" />
          <div className="relative rounded-3xl p-2 shadow-2xl">
            <img
              src="/assets/generated/app-logo.dim_256x256.png"
              alt="MediClear Logo"
              className="w-28 h-28 object-contain rounded-2xl"
            />
          </div>
        </div>

        {/* App name */}
        <div className="text-center">
          <h1 className="text-primary-foreground font-display font-extrabold text-4xl tracking-tight">
            MediClear
          </h1>
          <p className="text-primary-foreground/80 font-sans text-base mt-1 font-medium">
            Medical Reports, Simplified
          </p>
        </div>

        {/* Tagline */}
        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/20">
          <Activity className="h-4 w-4 text-primary-foreground/90" />
          <span className="text-primary-foreground/90 text-sm font-medium">
            Understand your health, simply
          </span>
        </div>
      </div>

      {/* Loading dots */}
      <div className={`absolute bottom-16 flex gap-2 transition-all duration-700 delay-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white/60 animate-pulse-soft"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
