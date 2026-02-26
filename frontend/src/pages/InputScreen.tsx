import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { FileText, Pill, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSubmitReport } from '@/hooks/useQueries';
import { simplifyReport } from '@/lib/medicalSimplifier';
import { saveOriginalTexts } from './ResultsScreen';

export function InputScreen() {
  const navigate = useNavigate();
  const [reportText, setReportText] = useState('');
  const [prescriptionText, setPrescriptionText] = useState('');
  const [validationError, setValidationError] = useState('');

  const submitMutation = useSubmitReport();

  const hasContent = reportText.trim().length > 0 || prescriptionText.trim().length > 0;

  const handleSubmit = async () => {
    if (!hasContent) {
      setValidationError('Please enter at least one report or prescription.');
      return;
    }
    setValidationError('');

    // Client-side simplification
    const { keyFindings, medications, actionSteps } = simplifyReport(reportText, prescriptionText);

    try {
      const reportId = await submitMutation.mutateAsync({
        reportText,
        prescriptionText,
        keyFindings,
        medications,
        actionSteps,
      });

      // Persist original texts to localStorage for the Original Input tab
      saveOriginalTexts(reportId.toString(), reportText, prescriptionText);

      navigate({ to: '/results/$reportId', params: { reportId: reportId.toString() } });
    } catch (err) {
      console.error('Failed to submit report:', err);
    }
  };

  return (
    <AppLayout showHistory>
      {/* Hero section */}
      <div className="animate-fade-in mb-6 pt-2">
        <div className="flex items-center gap-3 mb-3">
          <div className="gradient-header rounded-2xl p-2.5 shadow-sm">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground leading-tight">
              Simplify Your Report
            </h1>
            <p className="text-muted-foreground text-sm">
              Understand your health in plain language
            </p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed bg-accent/50 rounded-xl p-3 border border-border">
          Paste your medical report or doctor's prescription below. We'll translate the medical terms into simple, easy-to-understand language.
        </p>
      </div>

      {/* Pathological Report Input */}
      <div className="animate-slide-up animate-delay-100 mb-4">
        <div className="section-card">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="bg-primary/10 rounded-xl p-2">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <label className="font-display font-semibold text-foreground text-sm block">
                Pathological / Lab Report
              </label>
              <span className="text-muted-foreground text-xs">Blood tests, urine analysis, biopsy, etc.</span>
            </div>
          </div>
          <Textarea
            value={reportText}
            onChange={(e) => {
              setReportText(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder={`Paste your lab report here...\n\nExample:\nHemoglobin: 9.2 g/dL (Low)\nWBC: 11,500 cells/μL (High)\nBlood Glucose: 185 mg/dL\nCreatinine: 1.4 mg/dL`}
            className="min-h-[140px] text-base resize-none border-border/60 focus:border-primary/50 rounded-xl bg-background/50 placeholder:text-muted-foreground/60 placeholder:text-sm"
          />
        </div>
      </div>

      {/* Prescription Input */}
      <div className="animate-slide-up animate-delay-200 mb-4">
        <div className="section-card">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="bg-success/10 rounded-xl p-2">
              <Pill className="h-4 w-4 text-success" />
            </div>
            <div>
              <label className="font-display font-semibold text-foreground text-sm block">
                Doctor's Prescription
              </label>
              <span className="text-muted-foreground text-xs">Medicines, dosages, instructions</span>
            </div>
          </div>
          <Textarea
            value={prescriptionText}
            onChange={(e) => {
              setPrescriptionText(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder={`Paste your prescription here...\n\nExample:\n1. Metformin 500mg BD after food\n2. Amlodipine 5mg OD morning\n3. Atorvastatin 10mg HS\n4. Vitamin D3 60000 IU weekly`}
            className="min-h-[140px] text-base resize-none border-border/60 focus:border-primary/50 rounded-xl bg-background/50 placeholder:text-muted-foreground/60 placeholder:text-sm"
          />
        </div>
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="animate-fade-in flex items-center gap-2 text-destructive bg-destructive/10 rounded-xl p-3 mb-4 border border-destructive/20">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{validationError}</span>
        </div>
      )}

      {/* Submit Error */}
      {submitMutation.isError && (
        <div className="animate-fade-in flex items-center gap-2 text-destructive bg-destructive/10 rounded-xl p-3 mb-4 border border-destructive/20">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">Failed to process report. Please try again.</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="animate-slide-up animate-delay-300">
        <Button
          onClick={handleSubmit}
          disabled={!hasContent || submitMutation.isPending}
          className="w-full h-14 text-base font-display font-bold rounded-2xl gradient-header border-0 shadow-glow tap-target disabled:opacity-50 disabled:shadow-none"
          size="lg"
        >
          {submitMutation.isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Simplifying...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Simplify Report
            </span>
          )}
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-muted-foreground text-xs mt-4 leading-relaxed px-2">
        ⚕️ This app simplifies medical language for better understanding. Always consult your doctor for medical advice.
      </p>

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
    </AppLayout>
  );
}
