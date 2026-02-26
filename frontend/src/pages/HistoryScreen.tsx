import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Clock,
  ChevronRight,
  FileText,
  Inbox,
  AlertCircle,
  Star,
  Trash2,
  Search,
  BookmarkCheck,
  SearchX,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { AppLayout } from '@/components/layout/AppLayout';
import { useGetHistory, useDeleteReport } from '@/hooks/useQueries';
import { useLanguage } from '@/hooks/useLanguage';

function formatTimestamp(nanoseconds: bigint): string {
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
  const { t } = useLanguage();
  const { data: history, isLoading, isError, refetch } = useGetHistory();
  const deleteReportMutation = useDeleteReport();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  // Sort newest first
  const sortedHistory = history
    ? [...history].sort((a, b) => (a[0] > b[0] ? -1 : a[0] < b[0] ? 1 : 0))
    : [];

  // Apply favourites filter
  const afterFavFilter = showFavouritesOnly
    ? sortedHistory.filter(([, , , isBookmarked]) => isBookmarked)
    : sortedHistory;

  // Apply search filter (case-insensitive, searches excerpt + date)
  const filteredHistory = searchQuery.trim()
    ? afterFavFilter.filter(([timestamp, excerpt]) => {
        const q = searchQuery.toLowerCase();
        const excerptMatch = excerpt.toLowerCase().includes(q);
        const dateMatch = formatTimestamp(timestamp).toLowerCase().includes(q);
        return excerptMatch || dateMatch;
      })
    : afterFavFilter;

  const handleDelete = async (reportId: bigint) => {
    setDeletingId(reportId);
    try {
      await deleteReportMutation.mutateAsync(reportId);
      toast.success(t.reportDeleted);
    } catch {
      toast.error(t.error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AppLayout title="Report History" showBack>
      <div className="pt-2">
        {/* Search bar */}
        <div className="relative mb-3 animate-fade-in">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl border-border bg-background/80 text-sm h-10"
          />
        </div>

        {/* Favourites toggle */}
        <div className="flex items-center gap-2 mb-4 animate-fade-in">
          <Switch
            id="fav-toggle"
            checked={showFavouritesOnly}
            onCheckedChange={setShowFavouritesOnly}
            className="data-[state=checked]:bg-warning"
          />
          <Label htmlFor="fav-toggle" className="text-sm text-muted-foreground cursor-pointer flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-warning" fill={showFavouritesOnly ? 'currentColor' : 'none'} />
            {t.showFavouritesOnly}
          </Label>
        </div>

        {/* Loading skeletons */}
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

        {/* Error state */}
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

        {/* Empty state — no reports at all */}
        {!isLoading && !isError && sortedHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fade-in">
            <div className="bg-muted rounded-full p-6">
              <Inbox className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-foreground text-lg">{t.historyEmpty}</p>
              <p className="text-muted-foreground text-sm mt-1 max-w-[240px] leading-relaxed">
                {t.historyEmptySubtitle}
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

        {/* Empty state — favourites filter active but none bookmarked */}
        {!isLoading && !isError && sortedHistory.length > 0 && showFavouritesOnly && afterFavFilter.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 animate-fade-in">
            <div className="bg-warning/10 rounded-full p-5">
              <BookmarkCheck className="h-8 w-8 text-warning" />
            </div>
            <p className="text-muted-foreground text-sm text-center max-w-[260px] leading-relaxed">
              {t.noFavourites}
            </p>
          </div>
        )}

        {/* Empty state — search yields no results */}
        {!isLoading && !isError && sortedHistory.length > 0 && searchQuery.trim() && filteredHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 animate-fade-in">
            <div className="bg-muted rounded-full p-5">
              <SearchX className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm text-center max-w-[260px] leading-relaxed">
              {t.noSearchResults}
            </p>
          </div>
        )}

        {/* History list */}
        {!isLoading && !isError && filteredHistory.length > 0 && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-muted-foreground text-sm mb-4">
              {filteredHistory.length} report{filteredHistory.length !== 1 ? 's' : ''}
              {searchQuery.trim() ? ' found' : ' processed'}
            </p>
            {filteredHistory.map(([timestamp, excerpt, reportId, isBookmarked], idx) => (
              <div
                key={reportId.toString()}
                className="section-card flex items-start gap-3 animate-slide-up hover:shadow-card-hover transition-all duration-150"
                style={{ animationDelay: `${idx * 0.05}s`, opacity: 0 }}
              >
                {/* Icon */}
                <div className="bg-primary/10 rounded-xl p-2.5 flex-shrink-0 mt-0.5">
                  <FileText className="h-5 w-5 text-primary" />
                </div>

                {/* Content — tappable area */}
                <button
                  onClick={() =>
                    navigate({ to: '/results/$reportId', params: { reportId: reportId.toString() } })
                  }
                  className="flex-1 min-w-0 text-left"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground text-xs">
                      {formatTimestamp(timestamp)}
                    </span>
                    {isBookmarked && (
                      <Star className="h-3 w-3 text-warning ml-auto flex-shrink-0" fill="currentColor" />
                    )}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed line-clamp-2">
                    {getExcerpt(excerpt)}
                  </p>
                  <span className="text-primary text-xs font-medium mt-1.5 inline-block">
                    View full report →
                  </span>
                </button>

                {/* Delete button with confirmation */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="flex-shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors tap-target"
                      aria-label={t.deleteReport}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {deletingId === reportId ? (
                        <span className="h-4 w-4 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin block" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl mx-4">
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t.deleteConfirmDescription}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">{t.deleteConfirmCancel}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(reportId)}
                        className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {t.deleteConfirmAction}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
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
