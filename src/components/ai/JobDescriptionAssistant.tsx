import React, { useState } from 'react';
import { Bot, CheckCircle2, HelpCircle, ListChecks, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

interface JobDescriptionAssistantProps {
  initialPrompt?: string;
  categoryHint?: string;
  onApply: (data: {
    enhancedDescription: string;
    suggestedCategory: string;
    diagnosticQuestions: string[];
    checklist: string[];
  }) => void;
  onClose: () => void;
}

export const JobDescriptionAssistant: React.FC<JobDescriptionAssistantProps> = ({
  initialPrompt = '',
  categoryHint = '',
  onApply,
  onClose,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    enhancedDescription: string;
    suggestedCategory: string;
    diagnosticQuestions: string[];
    checklist: string[];
    aiGenerated?: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a brief description of the job or problem first.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/describe-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputPrompt: prompt, categoryHint }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.warn('Using intelligent client diagnostic fallback:', err);
      // Fallback
      setResult({
        enhancedDescription: `Client reported: "${prompt}". Technical assessment needed to evaluate component wear, pipe/circuit integrity, and underlying faults.`,
        suggestedCategory: categoryHint || 'Other household maintenance',
        diagnosticQuestions: [
          'How long has this issue been observed?',
          'Is there any unusual sound, burning smell, or continuous dripping?',
          'Has any previous repair or part replacement been conducted on this unit?',
        ],
        checklist: [
          'Inspect surrounding area for moisture or electrical grounding faults',
          'Verify appliance model number and serial tag',
          'Provide upfront cost estimate before commencing parts replacement',
        ],
        aiGenerated: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAndApply = () => {
    if (result) {
      onApply({
        enhancedDescription: result.enhancedDescription,
        suggestedCategory: result.suggestedCategory,
        diagnosticQuestions: result.diagnosticQuestions,
        checklist: result.checklist,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Sparkles className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">AI Job Diagnostic Assistant</h3>
              <p className="text-xs text-slate-300">Convert natural words into professional technical specifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Natural Language Problem Description
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. My customer's AC is leaking water from the indoor unit and making a humming sound when the compressor turns on..."
              rows={3}
              className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            {error && (
              <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {error}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Powered by Gemini 3.8 Flash • Review required before saving
            </span>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                  <span>Analyze & Structure Job</span>
                </>
              )}
            </button>
          </div>

          {result && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Structured Specification
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-medium">
                  Category: {result.suggestedCategory}
                </span>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-600 mb-1">Clear Technical Summary:</div>
                <div className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {result.enhancedDescription}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  Diagnostic Follow-up Questions for Customer:
                </div>
                <ul className="text-xs text-slate-700 space-y-1 bg-white p-3 rounded-lg border border-slate-200 list-disc list-inside">
                  {result.diagnosticQuestions.map((q, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <ListChecks className="w-3.5 h-3.5 text-teal-600" />
                  On-site Safety & Scoping Checklist:
                </div>
                <ul className="text-xs text-slate-700 space-y-1 bg-white p-3 rounded-lg border border-slate-200 list-disc list-inside">
                  {result.checklist.map((c, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmAndApply}
            disabled={!result}
            className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition"
          >
            Confirm & Apply to Request
          </button>
        </div>
      </div>
    </div>
  );
};
