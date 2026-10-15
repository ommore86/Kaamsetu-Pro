import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
app.use(express.json({ limit: '10mb' }));

// Shared Gemini client utility on the server
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!apiKey,
    service: 'KaamSetu Pro Server',
  });
});

// AI Feature 1: Describe the Job
app.post('/api/gemini/describe-job', async (req: Request, res: Response) => {
  const { inputPrompt, categoryHint } = req.body;

  if (!inputPrompt || typeof inputPrompt !== 'string') {
    return res.status(400).json({ error: 'inputPrompt is required' });
  }

  // Fallback heuristic if Gemini is not configured
  const getFallback = () => {
    const text = inputPrompt.toLowerCase();
    let detectedCategory = categoryHint || 'Other household maintenance';
    if (text.includes('ac') || text.includes('air condition') || text.includes('cooling') || text.includes('compressor')) {
      detectedCategory = 'AC installation and repair';
    } else if (text.includes('leak') || text.includes('pipe') || text.includes('tap') || text.includes('drain') || text.includes('plumb')) {
      detectedCategory = 'Plumbing';
    } else if (text.includes('electric') || text.includes('switch') || text.includes('spark') || text.includes('mcb') || text.includes('wire')) {
      detectedCategory = 'Electrical repairs';
    } else if (text.includes('wood') || text.includes('door') || text.includes('hinge') || text.includes('carpenter') || text.includes('table')) {
      detectedCategory = 'Carpentry';
    } else if (text.includes('fridge') || text.includes('refrigerator') || text.includes('washing machine') || text.includes('dryer')) {
      detectedCategory = 'Washing machine and refrigerator repair';
    } else if (text.includes('paint') || text.includes('wall') || text.includes('dampness')) {
      detectedCategory = 'Painting';
    } else if (text.includes('clean') || text.includes('deep clean') || text.includes('sanitize')) {
      detectedCategory = 'Cleaning';
    }

    return {
      enhancedDescription: `Customer reports: "${inputPrompt}". Technical assessment required to evaluate component wear, pipe/circuit integrity, and underlying functional faults.`,
      suggestedCategory: detectedCategory,
      diagnosticQuestions: [
        'How long has this issue been observed?',
        'Is there any unusual sound, burning smell, or continuous dripping?',
        'Has any previous repair or part replacement been conducted on this unit?',
        'Is the main power/water isolation valve accessible near the installation?'
      ],
      checklist: [
        'Inspect surrounding area for moisture or electrical grounding faults',
        'Verify appliance model number and serial tag',
        'Check primary power supply / water inlet pressure',
        'Provide upfront cost estimate before commencing parts replacement'
      ],
      aiGenerated: false,
    };
  };

  if (!ai) {
    return res.json(getFallback());
  }

  try {
    const prompt = `Analyze this Indian household service problem description and structure it into professional technical details:
Description: "${inputPrompt}"
Category Hint: "${categoryHint || 'None'}"

Valid categories:
- Plumbing
- Electrical repairs
- AC installation and repair
- Carpentry
- Washing machine and refrigerator repair
- Appliance repair
- Painting
- Cleaning
- Furniture assembly
- Other household maintenance

Format response as strict JSON with:
1. enhancedDescription: Clear, professional, technical summary of the job.
2. suggestedCategory: Must be one of the exact categories above.
3. diagnosticQuestions: List of 3-5 crucial questions the technician should ask the customer.
4. checklist: List of 4-5 safety or scoping checklist items before starting work.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            enhancedDescription: { type: Type.STRING },
            suggestedCategory: { type: Type.STRING },
            diagnosticQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            checklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['enhancedDescription', 'suggestedCategory', 'diagnosticQuestions', 'checklist'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      enhancedDescription: parsed.enhancedDescription || inputPrompt,
      suggestedCategory: parsed.suggestedCategory || categoryHint || 'Other household maintenance',
      diagnosticQuestions: parsed.diagnosticQuestions || [],
      checklist: parsed.checklist || [],
      aiGenerated: true,
    });
  } catch (error) {
    console.error('Gemini describe-job error:', error);
    return res.json(getFallback());
  }
});

// AI Feature 2: Draft a Quotation (Code enforces totals and arithmetic; AI helps draft scope & terms)
app.post('/api/gemini/draft-quotation', async (req: Request, res: Response) => {
  const { customerName, jobTitle, items, taxRate = 18, discount = 0, currency = 'INR' } = req.body;

  // Strict code-enforced arithmetic
  const safeItems = Array.isArray(items) ? items : [];
  const calculatedItems = safeItems.map((item: any) => {
    const qty = Math.max(1, Number(item.quantity) || 1);
    const rate = Math.max(0, Number(item.unitPrice) || 0);
    const total = qty * rate;
    return {
      description: String(item.description || 'Service item'),
      quantity: qty,
      unitPrice: rate,
      total,
      type: item.type === 'material' ? 'material' : 'labour',
    };
  });

  const subtotal = calculatedItems.reduce((acc: number, item: any) => acc + item.total, 0);
  const safeDiscount = Math.max(0, Math.min(Number(discount) || 0, subtotal));
  const taxableAmount = Math.max(0, subtotal - safeDiscount);
  const safeTaxRate = Math.max(0, Number(taxRate) || 0);
  const taxAmount = Math.round((taxableAmount * (safeTaxRate / 100)) * 100) / 100;
  const grandTotal = taxableAmount + taxAmount;

  let termsAndConditions = [
    '50% advance payment required upon commencement of on-site work.',
    'Quotation valid for 15 days from issue date.',
    'Any additional unlisted parts or concealed wall damage will be billed on actuals after customer verbal approval.',
    '30-day post-service workmanship warranty included on labour.',
  ];
  let scopeSummary = `Comprehensive service for ${jobTitle || 'Household Maintenance'} for ${customerName || 'Customer'}.`;

  if (ai) {
    try {
      const prompt = `Draft professional, standard Indian contractor terms and a clear 2-sentence scope summary for this quotation:
Job: ${jobTitle}
Customer: ${customerName}
Item list: ${JSON.stringify(calculatedItems)}
Total: ₹${grandTotal}

Provide JSON with:
1. scopeSummary: 2-3 sentences summarizing the deliverable.
2. termsAndConditions: Array of 4-5 standard, fair trade terms suitable for Mumbai/Indian domestic services.`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scopeSummary: { type: Type.STRING },
              termsAndConditions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['scopeSummary', 'termsAndConditions'],
          },
        },
      });

      const parsed = JSON.parse(aiResponse.text || '{}');
      if (parsed.scopeSummary) scopeSummary = parsed.scopeSummary;
      if (Array.isArray(parsed.termsAndConditions) && parsed.termsAndConditions.length > 0) {
        termsAndConditions = parsed.termsAndConditions;
      }
    } catch (err) {
      console.warn('AI quotation drafting fallback used:', err);
    }
  }

  return res.json({
    items: calculatedItems,
    subtotal,
    discount: safeDiscount,
    taxRate: safeTaxRate,
    taxAmount,
    grandTotal,
    currency,
    scopeSummary,
    termsAndConditions,
    expiryDays: 15,
  });
});

// AI Feature 3: Business Assistant (scoped strictly to authenticated professional's provided business records)
app.post('/api/gemini/business-assistant', async (req: Request, res: Response) => {
  const { question, context } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question is required' });
  }

  // Pre-calculate verified figures from context
  const jobs = Array.isArray(context?.jobs) ? context.jobs : [];
  const invoices = Array.isArray(context?.invoices) ? context.invoices : [];
  const quotations = Array.isArray(context?.quotations) ? context.quotations : [];
  const appointments = Array.isArray(context?.appointments) ? context.appointments : [];
  const customers = Array.isArray(context?.customers) ? context.customers : [];

  const overdueInvoices = invoices.filter((inv: any) => inv.status === 'overdue' || (inv.status === 'unpaid' && new Date(inv.dueDate) < new Date()));
  const totalOverdueAmount = overdueInvoices.reduce((sum: number, inv: any) => sum + (Number(inv.grandTotal || inv.total) - Number(inv.amountPaid || 0)), 0);

  const pendingQuotations = quotations.filter((q: any) => q.status === 'sent' || q.status === 'pending');
  const activeJobs = jobs.filter((j: any) => j.status === 'in_progress' || j.status === 'scheduled');

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const paidInvoicesThisMonth = invoices.filter((inv: any) => {
    const invDate = new Date(inv.createdAt || inv.paidAt || inv.date);
    return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear && (inv.status === 'paid' || Number(inv.amountPaid) > 0);
  });
  const monthlyRevenueRecorded = paidInvoicesThisMonth.reduce((sum: number, inv: any) => sum + Number(inv.amountPaid || inv.grandTotal || 0), 0);

  // Fallback direct calculation answer
  const qLower = question.toLowerCase();
  let directAnswer = '';
  if (qLower.includes('overdue') || qLower.includes('unpaid')) {
    directAnswer = `You currently have ${overdueInvoices.length} overdue/unpaid invoice(s) totaling ₹${totalOverdueAmount.toLocaleString('en-IN')}.`;
  } else if (qLower.includes('revenue') || qLower.includes('earned') || qLower.includes('this month')) {
    directAnswer = `Your recorded collected revenue this month is ₹${monthlyRevenueRecorded.toLocaleString('en-IN')} across ${paidInvoicesThisMonth.length} transaction(s).`;
  } else if (qLower.includes('quotation') || qLower.includes('quote') || qLower.includes('approval')) {
    directAnswer = `You have ${pendingQuotations.length} pending quotation(s) awaiting customer review.`;
  } else if (qLower.includes('tomorrow') || qLower.includes('appointment') || qLower.includes('schedule')) {
    directAnswer = `You have ${appointments.length} appointment(s) scheduled on your calendar. Active ongoing jobs count: ${activeJobs.length}.`;
  } else if (qLower.includes('customer')) {
    directAnswer = `You have ${customers.length} customer profile(s) recorded in your client directory.`;
  } else {
    directAnswer = `Overview from your verified records:
• Recorded revenue this month: ₹${monthlyRevenueRecorded.toLocaleString('en-IN')}
• Overdue invoices: ${overdueInvoices.length} (Total ₹${totalOverdueAmount.toLocaleString('en-IN')})
• Pending quotations: ${pendingQuotations.length}
• Active jobs: ${activeJobs.length}
• Total customers: ${customers.length}`;
  }

  if (!ai) {
    return res.json({
      answer: directAnswer,
      verifiedMetrics: {
        monthlyRevenueRecorded,
        overdueCount: overdueInvoices.length,
        totalOverdueAmount,
        pendingQuotesCount: pendingQuotations.length,
        activeJobsCount: activeJobs.length,
      },
      aiGenerated: false,
    });
  }

  try {
    const systemPrompt = `You are KaamSetu Pro's Business Assistant.
You MUST answer questions strictly using the authenticated professional's verified business records provided in context.
NEVER make up facts, never guess financial values. Numerical answers must match the pre-calculated metrics.
Keep the answer polite, concise, professional, and tailored for Indian local business owners.

Context Data:
- Total Customers: ${customers.length}
- Active Jobs (${activeJobs.length}): ${JSON.stringify(activeJobs.slice(0, 5))}
- Pending Quotations (${pendingQuotations.length}): ${JSON.stringify(pendingQuotations.slice(0, 5))}
- Overdue Invoices (${overdueInvoices.length}): ${JSON.stringify(overdueInvoices.slice(0, 5))}
- Total Overdue Balance: ₹${totalOverdueAmount}
- Recorded Revenue This Month: ₹${monthlyRevenueRecorded}
- Appointments (${appointments.length}): ${JSON.stringify(appointments.slice(0, 5))}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: question,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    return res.json({
      answer: response.text || directAnswer,
      verifiedMetrics: {
        monthlyRevenueRecorded,
        overdueCount: overdueInvoices.length,
        totalOverdueAmount,
        pendingQuotesCount: pendingQuotations.length,
        activeJobsCount: activeJobs.length,
      },
      aiGenerated: true,
    });
  } catch (err) {
    console.error('Gemini business-assistant error:', err);
    return res.json({
      answer: directAnswer,
      verifiedMetrics: {
        monthlyRevenueRecorded,
        overdueCount: overdueInvoices.length,
        totalOverdueAmount,
        pendingQuotesCount: pendingQuotations.length,
        activeJobsCount: activeJobs.length,
      },
      aiGenerated: false,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`KaamSetu Pro server listening on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
