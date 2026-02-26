import { useState, useEffect } from 'react';
import { useParams } from '@tanstack/react-router';
import {
  Search,
  Pill,
  CheckCircle2,
  Globe,
  Copy,
  Check,
  AlertCircle,
  Star,
  Share2,
  FileText,
  ClipboardList,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AppLayout } from '@/components/layout/AppLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetSummary, useToggleBookmark } from '@/hooks/useQueries';
import { useLanguage } from '@/hooks/useLanguage';
import { useFontSize, fontSizeClasses } from '@/hooks/useFontSize';
import { languageNames, type Language, rtlLanguages } from '@/i18n/translations';

// localStorage key for storing original report text per reportId
const ORIGINAL_TEXT_KEY = 'mediclear_original_';

export function getOriginalTexts(reportId: string): { reportText: string; prescriptionText: string } {
  try {
    const stored = localStorage.getItem(ORIGINAL_TEXT_KEY + reportId);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return { reportText: '', prescriptionText: '' };
}

export function saveOriginalTexts(reportId: string, reportText: string, prescriptionText: string) {
  try {
    localStorage.setItem(ORIGINAL_TEXT_KEY + reportId, JSON.stringify({ reportText, prescriptionText }));
  } catch {
    // ignore
  }
}

export function ResultsScreen() {
  const { reportId } = useParams({ from: '/results/$reportId' });
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { fontSize, setFontSize } = useFontSize();

  const reportIdBigInt = BigInt(reportId);
  const { data: summary, isLoading, isError, refetch } = useGetSummary(reportIdBigInt);
  const toggleBookmarkMutation = useToggleBookmark();

  // Read bookmark state from history cache or localStorage
  const [bookmarkInitialized, setBookmarkInitialized] = useState(false);

  useEffect(() => {
    if (!bookmarkInitialized) {
      try {
        const stored = localStorage.getItem('mediclear_bookmark_' + reportId);
        if (stored !== null) {
          setIsBookmarked(stored === 'true');
        }
      } catch {
        // ignore
      }
      setBookmarkInitialized(true);
    }
  }, [reportId, bookmarkInitialized]);

  const isRtl = rtlLanguages.includes(language);
  const originalTexts = getOriginalTexts(reportId);

  const buildSummaryText = () => {
    if (!summary) return '';
    return [
      `=== ${t.keyFindings} ===`,
      ...summary.keyFindings.map((f) => `• ${f}`),
      '',
      `=== ${t.medications} ===`,
      ...summary.medications.map((m) => `• ${m.name}: ${m.purpose} (${m.dosage})`),
      '',
      `=== ${t.whatToDoNext} ===`,
      ...summary.actionSteps.map((s) => `• ${s.description}`),
    ].join('\n');
  };

  const handleCopy = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(buildSummaryText());
      setCopied(true);
      toast.success(t.copiedToClipboard);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    if (!summary) return;
    const text = buildSummaryText();
    if (navigator.share) {
      try {
        await navigator.share({ title: t.shareTitle, text });
      } catch (err: unknown) {
        // User cancelled share — not an error
        if (err instanceof Error && err.name !== 'AbortError') {
          // Fallback to clipboard
          try {
            await navigator.clipboard.writeText(text);
            toast.success(t.copiedToClipboard);
          } catch {
            // ignore
          }
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(text);
        toast.success(t.copiedToClipboard);
      } catch {
        // ignore
      }
    }
  };

  const handleToggleBookmark = async () => {
    try {
      await toggleBookmarkMutation.mutateAsync(reportIdBigInt);
      const newState = !isBookmarked;
      setIsBookmarked(newState);
      try {
        localStorage.setItem('mediclear_bookmark_' + reportId, String(newState));
      } catch {
        // ignore
      }
      toast.success(newState ? t.bookmarkAdded : t.bookmarkRemoved);
    } catch {
      toast.error(t.error);
    }
  };

  if (isLoading) {
    return (
      <AppLayout showBack showNew title={t.resultsTitle}>
        <div className="space-y-4 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="section-card space-y-3">
              <Skeleton className="h-5 w-32 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-4/5 rounded-lg" />
              <Skeleton className="h-4 w-3/5 rounded-lg" />
            </div>
          ))}
        </div>
      </AppLayout>
    );
  }

  if (isError || !summary) {
    return (
      <AppLayout showBack showNew title={t.resultsTitle}>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="bg-destructive/10 rounded-full p-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div className="text-center">
            <p className="font-display font-semibold text-foreground">{t.error}</p>
            <p className="text-muted-foreground text-sm mt-1">Could not load the report summary.</p>
          </div>
          <Button onClick={() => refetch()} variant="outline" className="rounded-xl tap-target">
            {t.retry}
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBack showNew title={t.resultsTitle}>
      <div dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Top Controls Row: Language + Font Size + Actions */}
        <div className="animate-fade-in pt-1 mb-4 space-y-2">
          {/* Row 1: Language selector + Bookmark */}
          <div className="flex items-center justify-between gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl tap-target border-border gap-1.5 font-medium text-sm"
                >
                  <Globe className="h-4 w-4 text-primary" />
                  <span>{languageNames[language]}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="rounded-xl">
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`rounded-lg cursor-pointer ${language === lang ? 'bg-accent font-semibold' : ''}`}
                  >
                    {languageNames[lang]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bookmark toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleBookmark}
              disabled={toggleBookmarkMutation.isPending}
              className={`rounded-xl tap-target border-border gap-1.5 font-medium text-sm transition-colors ${
                isBookmarked
                  ? 'bg-warning/10 border-warning/40 text-warning hover:bg-warning/20'
                  : 'hover:bg-accent'
              }`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark report'}
            >
              {toggleBookmarkMutation.isPending ? (
                <span className="h-4 w-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              ) : (
                <Star
                  className="h-4 w-4"
                  fill={isBookmarked ? 'currentColor' : 'none'}
                />
              )}
            </Button>
          </div>

          {/* Row 2: Font size controls + Copy + Share */}
          <div className="flex items-center justify-between gap-2">
            {/* Font size A- A A+ */}
            <div className="flex items-center gap-1 bg-muted/60 rounded-xl p-1">
              {(['small', 'medium', 'large'] as const).map((size, idx) => {
                const labels = [t.fontSizeSmall, t.fontSizeMedium, t.fontSizeLarge];
                const textSizes = ['text-xs', 'text-sm', 'text-base'];
                return (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${textSizes[idx]} ${
                      fontSize === size
                        ? 'bg-background shadow-sm text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    aria-label={`Font size ${size}`}
                    aria-pressed={fontSize === size}
                  >
                    {labels[idx]}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Share button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="rounded-xl tap-target border-border gap-1.5 font-medium text-sm"
                aria-label="Share report"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden xs:inline">Share</span>
              </Button>

              {/* Copy button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="rounded-xl tap-target border-border gap-1.5 font-medium text-sm"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span>{t.shareReport}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs: Simplified Summary vs Original Input */}
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="w-full rounded-xl mb-4 bg-muted/60">
            <TabsTrigger value="summary" className="flex-1 rounded-lg gap-1.5 text-sm font-medium">
              <ClipboardList className="h-3.5 w-3.5" />
              {t.simplifiedSummary}
            </TabsTrigger>
            <TabsTrigger value="original" className="flex-1 rounded-lg gap-1.5 text-sm font-medium">
              <FileText className="h-3.5 w-3.5" />
              {t.originalInput}
            </TabsTrigger>
          </TabsList>

          {/* ── Simplified Summary Tab ── */}
          <TabsContent value="summary" className="mt-0">
            {/* Key Findings Section */}
            <div className="animate-slide-up animate-delay-100 section-card mb-4">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="bg-primary/10 rounded-xl p-2">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <h2 className="font-display font-bold text-foreground text-base">{t.keyFindings}</h2>
                <Badge variant="secondary" className="ml-auto text-xs rounded-full">
                  {summary.keyFindings.length}
                </Badge>
              </div>

              {summary.keyFindings.length === 0 ? (
                <p className={`text-muted-foreground ${fontSizeClasses[fontSize]}`}>{t.noFindings}</p>
              ) : (
                <ul className="space-y-2.5">
                  {summary.keyFindings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <span className={`text-foreground ${fontSizeClasses[fontSize]} leading-relaxed`}>
                        {finding}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Medications Section */}
            <div className="animate-slide-up animate-delay-200 section-card mb-4">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="bg-success/10 rounded-xl p-2">
                  <Pill className="h-4 w-4 text-success" />
                </div>
                <h2 className="font-display font-bold text-foreground text-base">{t.medications}</h2>
                <Badge variant="secondary" className="ml-auto text-xs rounded-full">
                  {summary.medications.length}
                </Badge>
              </div>

              {summary.medications.length === 0 ? (
                <p className={`text-muted-foreground ${fontSizeClasses[fontSize]}`}>{t.noMedications}</p>
              ) : (
                <div className="space-y-3">
                  {summary.medications.map((med, idx) => (
                    <div
                      key={idx}
                      className="bg-success/5 border border-success/20 rounded-xl p-3"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className={`font-display font-semibold text-foreground ${fontSizeClasses[fontSize]} leading-tight`}>
                          {med.name}
                        </span>
                        <Badge className="bg-success/15 text-success border-0 text-xs rounded-full flex-shrink-0">
                          {t.medicationName}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-start gap-1.5">
                          <span className="text-muted-foreground text-xs font-medium min-w-[60px]">{t.medicationPurpose}:</span>
                          <span className={`text-foreground ${fontSizeClasses[fontSize]} leading-relaxed`}>{med.purpose}</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-muted-foreground text-xs font-medium min-w-[60px]">{t.medicationDosage}:</span>
                          <span className={`text-foreground ${fontSizeClasses[fontSize]} font-medium leading-relaxed`}>{med.dosage}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* What To Do Next Section */}
            <div className="animate-slide-up animate-delay-300 section-card mb-4">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="bg-warning/10 rounded-xl p-2">
                  <CheckCircle2 className="h-4 w-4 text-warning" />
                </div>
                <h2 className="font-display font-bold text-foreground text-base">{t.whatToDoNext}</h2>
                <Badge variant="secondary" className="ml-auto text-xs rounded-full">
                  {summary.actionSteps.length}
                </Badge>
              </div>

              {summary.actionSteps.length === 0 ? (
                <p className={`text-muted-foreground ${fontSizeClasses[fontSize]}`}>{t.noActions}</p>
              ) : (
                <ol className="space-y-3">
                  {summary.actionSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-warning/15 text-warning text-xs font-bold flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </span>
                      <span className={`text-foreground ${fontSizeClasses[fontSize]} leading-relaxed`}>
                        {step.description}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Disclaimer */}
            <div className="animate-slide-up animate-delay-400 bg-muted/50 rounded-xl p-3 border border-border mb-4">
              <p className="text-muted-foreground text-xs leading-relaxed text-center">
                ⚕️ This summary is for informational purposes only. Always consult your doctor for medical advice and treatment decisions.
              </p>
            </div>
          </TabsContent>

          {/* ── Original Input Tab ── */}
          <TabsContent value="original" className="mt-0 space-y-4">
            {/* Lab Report */}
            <div className="section-card">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="bg-primary/10 rounded-xl p-2">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <h2 className="font-display font-bold text-foreground text-base">{t.labReport}</h2>
              </div>
              {originalTexts.reportText ? (
                <pre className={`whitespace-pre-wrap font-sans ${fontSizeClasses[fontSize]} text-foreground leading-relaxed bg-muted/30 rounded-xl p-3 border border-border overflow-auto max-h-64`}>
                  {originalTexts.reportText}
                </pre>
              ) : (
                <p className="text-muted-foreground text-sm italic">{t.noOriginalText}</p>
              )}
            </div>

            {/* Prescription */}
            <div className="section-card">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="bg-success/10 rounded-xl p-2">
                  <Pill className="h-4 w-4 text-success" />
                </div>
                <h2 className="font-display font-bold text-foreground text-base">{t.prescription}</h2>
              </div>
              {originalTexts.prescriptionText ? (
                <pre className={`whitespace-pre-wrap font-sans ${fontSizeClasses[fontSize]} text-foreground leading-relaxed bg-muted/30 rounded-xl p-3 border border-border overflow-auto max-h-64`}>
                  {originalTexts.prescriptionText}
                </pre>
              ) : (
                <p className="text-muted-foreground text-sm italic">{t.noOriginalText}</p>
              )}
            </div>

            {/* Disclaimer */}
            <div className="bg-muted/50 rounded-xl p-3 border border-border">
              <p className="text-muted-foreground text-xs leading-relaxed text-center">
                ⚕️ This is the original text you submitted. The simplified summary is on the Summary tab.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-4 text-center text-muted-foreground text-xs">
          <p>
            {t.builtWith} ❤️ using{' '}
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
