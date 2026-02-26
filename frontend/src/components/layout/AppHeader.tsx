import { useNavigate, useLocation } from '@tanstack/react-router';
import { History, ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  showBack?: boolean;
  showHistory?: boolean;
  showNew?: boolean;
  title?: string;
}

export function AppHeader({ showBack = false, showHistory = true, showNew = false, title }: AppHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHistory = location.pathname === '/history';

  return (
    <header className="sticky top-0 z-50 w-full gradient-header shadow-md">
      <div className="mobile-container flex items-center justify-between h-14 px-4">
        {/* Left: Back button or Logo */}
        <div className="flex items-center gap-2 min-w-[44px]">
          {showBack ? (
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/20 tap-target rounded-xl"
              onClick={() => navigate({ to: '/input' })}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <button
              onClick={() => navigate({ to: '/input' })}
              className="flex items-center gap-2 tap-target"
              aria-label="Go to home"
            >
              <img
                src="/assets/generated/app-logo.dim_256x256.png"
                alt="MediClear Logo"
                className="h-8 w-8 rounded-lg object-contain"
              />
            </button>
          )}
        </div>

        {/* Center: Title or App Name */}
        <div className="flex-1 text-center">
          {title ? (
            <h1 className="text-primary-foreground font-display font-bold text-base leading-tight">
              {title}
            </h1>
          ) : (
            <button
              onClick={() => navigate({ to: '/input' })}
              className="flex items-center justify-center gap-2"
            >
              <span className="text-primary-foreground font-display font-bold text-lg tracking-tight">
                MediClear
              </span>
            </button>
          )}
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-1 min-w-[44px] justify-end">
          {showNew && (
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/20 tap-target rounded-xl"
              onClick={() => navigate({ to: '/input' })}
              aria-label="New report"
            >
              <Plus className="h-5 w-5" />
            </Button>
          )}
          {showHistory && !isHistory && (
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/20 tap-target rounded-xl"
              onClick={() => navigate({ to: '/history' })}
              aria-label="View history"
            >
              <History className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
