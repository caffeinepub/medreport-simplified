import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import {
  Search,
  Pill,
  CheckCircle2,
  Globe,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AppLayout } from '@/components/layout/AppLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetSummary } from '@/hooks/useQueries';
import { useLanguage } from '@/hooks/useLanguage';
import { languageNames, type Language, rtlLanguages } from '@/i18n/translations';

export function ResultsScreen() {
  const { reportId } = useParams({ from: '/results/$reportId' });
  const [copied, setCopied] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const reportIdBigInt = BigInt(reportId);
  const { data: summary, isLoading, isError, refetch } = useGetSummary(reportIdBigInt);

  const isRtl = rtlLanguages.includes(language);

  const handleCopy = async () => {
    if (!summary) return;

    const text = [
      `=== ${t.keyFindings} ===`,
      ...summary.keyFindings.map((f) => `• ${f}`),
      '',
      `=== ${t.medications} ===`,
      ...summary.medications.map((m) => `• ${m.name}: ${m.purpose} (${m.dosage})`),
      '',
      `=== ${t.whatToDoNext} ===`,
      ...summary.actionSteps.map((s) => `• ${s.description}`),
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
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
        {/* Language selector + Copy */}
        <div className="animate-fade-in flex items-center justify-between mb-4 pt-1">
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

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="rounded-xl tap-target border-border gap-1.5 font-medium text-sm"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-success" />
                <span className="text-success">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>{t.shareReport}</span>
              </>
            )}
          </Button>
        </div>

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
            <p className="text-muted-foreground text-base">{t.noFindings}</p>
          ) : (
            <ul className="space-y-2.5">
              {summary.keyFindings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-foreground text-base leading-relaxed">{finding}</span>
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
            <p className="text-muted-foreground text-base">{t.noMedications}</p>
          ) : (
            <div className="space-y-3">
              {summary.medications.map((med, idx) => (
                <div
                  key={idx}
                  className="bg-success/5 border border-success/20 rounded-xl p-3"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-display font-semibold text-foreground text-base leading-tight">
                      {med.name}
                    </span>
                    <Badge className="bg-success/15 text-success border-0 text-xs rounded-full flex-shrink-0">
                      {t.medicationName}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-start gap-1.5">
                      <span className="text-muted-foreground text-xs font-medium min-w-[60px]">{t.medicationPurpose}:</span>
                      <span className="text-foreground text-sm leading-relaxed">{med.purpose}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-muted-foreground text-xs font-medium min-w-[60px]">{t.medicationDosage}:</span>
                      <span className="text-foreground text-sm font-medium leading-relaxed">{med.dosage}</span>
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
            <p className="text-muted-foreground text-base">{t.noActions}</p>
          ) : (
            <ol className="space-y-3">
              {summary.actionSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-warning/15 text-warning text-xs font-bold flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-foreground text-base leading-relaxed">{step.description}</span>
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
