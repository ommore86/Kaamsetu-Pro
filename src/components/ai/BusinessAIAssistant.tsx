import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, Sparkles, Send, Loader2, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const BusinessAIAssistant: React.FC = () => {
  const { currentUser, jobs, invoices, quotations, customerRecords, payments } = useApp();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<
    Array<{ role: 'user' | 'assistant'; text: string; timestamp: string }>
  >([
    {
      role: 'assistant',
      text: `Namaste ${currentUser.name}! I am your KaamSetu Pro business assistant. I analyze only your authorized saved records for Sharma Electricals. You can ask about overdue invoices, upcoming jobs, pending estimates, or this month's recorded revenue.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const presetQuestions = [
    'Which invoices are overdue or unpaid?',
    'How much revenue have I recorded this month?',
    'Which quotations are awaiting customer approval?',
    'Which appointments do I have coming up?',
    'Show me follow-ups due for my customers',
  ];

  const handleAsk = async (queryText?: string) => {
    const q = queryText || question;
    if (!q.trim() || loading) return;

    const userMsg = {
      role: 'user' as const,
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setConversation((prev) => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    // Filter context data strictly to authenticated professional's records
    const contextPayload = {
      professionalId: currentUser.id,
      jobs: jobs.filter((j) => j.professionalId === currentUser.id),
      invoices: invoices.filter((inv) => inv.professionalId === currentUser.id),
      quotations: quotations.filter((qt) => qt.professionalId === currentUser.id),
      customers: customerRecords.filter((c) => c.professionalId === currentUser.id),
      appointments: jobs
        .filter((j) => j.professionalId === currentUser.id && (j.status === 'scheduled' || j.status === 'in_progress'))
        .map((j) => ({
          date: j.scheduledDate,
          time: j.scheduledTime,
          customer: j.customerName,
          category: j.serviceCategory,
        })),
    };

    try {
      const res = await fetch('/api/gemini/business-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, context: contextPayload }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.answer || 'No records found matching your query.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Business assistant query error:', err);
      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Unable to reach the assistant service at this moment. You can view all metrics directly on your Overview dashboard tabs.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
      {/* Header */}
      <div className="bg-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
            <Bot className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
              <span>KaamSetu Business AI Copilot</span>
              <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Verified Records Only
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Derives answers strictly from your saved jobs, quotes & invoices</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero external leak</span>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 overflow-x-auto flex items-center gap-1.5 text-xs no-scrollbar">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-1 shrink-0">
          Suggestions:
        </span>
        {presetQuestions.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => handleAsk(pq)}
            className="shrink-0 bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 text-[11px] transition"
          >
            {pq}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
        {conversation.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-bl-none whitespace-pre-line'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl p-3 w-fit">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
            <span>Analyzing your business records...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about overdue bills, scheduled jobs, revenue..."
            className="flex-1 text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!question.trim() || loading}
            className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white p-2.5 rounded-xl shadow-sm transition"
          >
            <Send className="w-4 h-4 text-teal-400" />
          </button>
        </form>
      </div>
    </div>
  );
};
