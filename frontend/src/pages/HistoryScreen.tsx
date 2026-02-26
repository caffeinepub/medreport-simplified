import { useNavigate } from '@tanstack/react-router';
import { Clock, ChevronRight, FileText, Inbox, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AppLayout } from '@/components/layout/AppLayout';
import { useGetHistory } from '@/hooks/useQueries';

function formatTimestamp(nanoseconds: bigint): string {
  // Convert nanoseconds to milliseconds
  const ms = Number(nanoseconds / BigInt(1_000_000));
  const date = new Date(ms);

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getExcerpt(text: string, maxLength = 100): string {
  if (!text) return 'No summary available';
  const cleaned = text.replace(/[🔍💊✅🚨💊🛏️🌡️💧🚫🥦🥗🥩☀️📅❓📊🍎🧂🚶]/g, '').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength).trim() + '...';
}

export function HistoryScreen() {
  const navigate = useNavigate();
  const { data: history, isLoading, isError, refetch } = useGetHistory();

  const sortedHistory = history
    ? [...history].sort((a, b) => (a[0] > b[0] ? -1 : a[0] < b[0] ? 1 : 0))
    : [];

  return (
    <AppLayout title="Report History" showBack>
      <div className="pt-2">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="section-card flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-28 rounded-lg" />
                  <Skeleton className="h-3 w-full rounded-lg" />
                  <Skeleton className="h-3 w-3/4 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="bg-destructive/10 rounded-full p-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="text-center">
              <p className="font-display font-semibold text-foreground">Failed to load history</p>
              <p className="text-muted-foreground text-sm mt-1">Please check your connection and try again.</p>
            </div>
            <Button onClick={() => refetch()} variant="outline" className="rounded-xl tap-target">
              Try Again
            </Button>
          </div>
        )}

        {!isLoading && !isError && sortedHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fade-in">
            <div className="bg-muted rounded-full p-6">
              <Inbox className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-foreground text-lg">No reports yet</p>
              <p className="text-muted-foreground text-sm mt-1 max-w-[240px] leading-relaxed">
                Your simplified reports will appear here after you process them.
              </p>
            </div>
            <Button
              onClick={() => navigate({ to: '/input' })}
              className="rounded-xl tap-target gradient-header border-0 font-semibold"
            >
              Create Your First Report
            </Button>
          </div>
        )}

        {!isLoading && !isError && sortedHistory.length > 0 && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-muted-foreground text-sm mb-4">
              {sortedHistory.length} report{sortedHistory.length !== 1 ? 's' : ''} processed
            </p>
            {sortedHistory.map(([timestamp, excerpt, reportId], idx) => (
              <button
                key={reportId.toString()}
                onClick={() => navigate({ to: '/results/$reportId', params: { reportId: reportId.toString() } })}
                className="w-full section-card flex items-start gap-3 text-left hover:shadow-card-hover active:scale-[0.98] transition-all duration-150 tap-target animate-slide-up"
                style={{ animationDelay: `${idx * 0.05}s`, opacity: 0 }}
              >
                {/* Icon */}
                <div className="bg-primary/10 rounded-xl p-2.5 flex-shrink-0 mt-0.5">
                  <FileText className="h-5 w-5 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground text-xs">
                      {formatTimestamp(timestamp)}
                    </span>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed line-clamp-2">
                    {getExcerpt(excerpt)}
                  </p>
                  <span className="text-primary text-xs font-medium mt-1.5 inline-block">
                    View full report →
                  </span>
                </div>

                {/* Arrow */}
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
              </button>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 text-center text-muted-foreground text-xs">
          <p>
            Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'mediclear-app')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="mt-1">© {new Date().getFullYear()} MediClear. All rights reserved.</p>
        </footer>
      </div>
    </AppLayout>
  );
}
