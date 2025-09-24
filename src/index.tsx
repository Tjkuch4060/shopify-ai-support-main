import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// API routes
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', message: 'AI Support Bot API is running' })
})

// ROI calculation endpoint
app.post('/api/roi-calculate', async (c) => {
  try {
    const { tickets, hoursPerTicket, wage } = await c.req.json()
    
    // Validate input data
    if (!tickets || !hoursPerTicket || !wage || tickets <= 0 || hoursPerTicket <= 0 || wage <= 0) {
      return c.json({ error: 'All fields must be positive numbers' }, 400)
    }
    
    const totalMonthlyCost = tickets * hoursPerTicket * wage
    const monthlySavings = totalMonthlyCost * 0.40
    const roundedSavings = Math.round(monthlySavings / 50) * 50
    
    return c.json({
      totalMonthlyCost,
      monthlySavings,
      roundedSavings,
      savingsPercentage: 40,
      calculatedAt: new Date().toISOString()
    })
  } catch (error) {
    return c.json({ error: 'Invalid input data' }, 400)
  }
})

// Lead capture endpoint
app.post('/api/capture-lead', async (c) => {
  try {
    const { 
      email, 
      name, 
      company, 
      monthlyTickets, 
      currentMonthlyCost, 
      potentialSavings, 
      phone, 
      source 
    } = await c.req.json()
    
    // Validate required fields
    if (!email || !name) {
      return c.json({ error: 'Email and name are required' }, 400)
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Invalid email format' }, 400)
    }
    
    // Create lead object
    const lead = {
      id: crypto.randomUUID(),
      email: email.toLowerCase().trim(),
      name: name.trim(),
      company: company?.trim() || '',
      monthlyTickets: monthlyTickets || 0,
      currentMonthlyCost: currentMonthlyCost || 0,
      potentialSavings: potentialSavings || 0,
      phone: phone?.trim() || '',
      source: source || 'roi-calculator',
      timestamp: new Date().toISOString(),
      userAgent: c.req.header('User-Agent') || '',
      ipAddress: c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown'
    }
    
    // TODO: In production, save to database (D1, KV, or external service)
    // For now, we'll log the lead (in production, replace with database save)
    console.log('New lead captured:', JSON.stringify(lead, null, 2))
    
    // Simulate successful lead capture
    return c.json({ 
      success: true, 
      message: 'Lead captured successfully',
      leadId: lead.id,
      nextStep: 'We\'ll contact you within 24 hours for your free audit'
    })
    
  } catch (error) {
    console.error('Lead capture error:', error)
    return c.json({ error: 'Failed to capture lead' }, 500)
  }
})

// Get leads endpoint (for internal use/debugging)
app.get('/api/leads', async (c) => {
  // TODO: In production, add authentication and fetch from database
  return c.json({ 
    message: 'Leads endpoint - requires authentication in production',
    totalLeads: 0,
    leads: []
  })
})

// Main landing page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Support Bot for Shopify Stores – 40% Fewer Tickets in 30 Days | Lumin Agency</title>
        <meta name="description" content="Cut Shopify customer-support cost 40% in 30 days with a custom AI bot. Free 15-min audit. No code. ROI guarantee.">
        <link rel="canonical" href="https://shopify-ai-support-main.vercel.app/">
        <link rel="icon" href="data:image/svg+xml,%3csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cfilter id='glow' x='-50%25' y='-50%25' width='200%25' height='200%25'%3e%3cfeGaussianBlur stdDeviation='3' result='coloredBlur'/%3e%3cfeMerge%3e%3cfeMergeNode in='coloredBlur'/%3e%3cfeMergeNode in='SourceGraphic'/%3e%3c/feMerge%3e%3c/filter%3e%3c/defs%3e%3ccircle cx='16' cy='16' r='10' fill='%238b5cf6' filter='url(%23glow)'/%3e%3c/svg%3e">
        
        <!-- Google tag (gtag.js) -->
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GOOGLE_TAG_ID"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'YOUR_GOOGLE_TAG_ID'); // Replace with your actual Google Tag ID
        </script>
        <!-- End Google tag -->

        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <link href="/static/style.css" rel="stylesheet">
    </head>
    <body class="text-slate-200">
        <header class="bg-slate-900/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
            <nav class="container mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <a href="#" class="text-2xl font-bold text-white">Lumin Agency</a>
                    <div class="hidden md:flex items-center space-x-8">
                        <a href="#roi-calculator" class="text-slate-300 hover:text-white transition whitespace-nowrap">ROI Calculator</a>
                        <a href="#audit-cal" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition whitespace-nowrap">Get Free AI Audit</a>
                    </div>
                    <div class="md:hidden">
                        <button id="mobile-menu-button" class="text-white">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        </button>
                    </div>
                </div>
                <!-- Mobile Menu -->
                <div id="mobile-menu" class="hidden md:hidden mt-4">
                    <a href="#roi-calculator" class="block py-2 text-slate-300 hover:text-white">ROI Calculator</a>
                    <a href="#audit-cal" class="block mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">Get Free AI Audit</a>
                </div>
            </nav>
        </header>

        <main>
            <!-- Hero Section -->
            <section class="aurora-background pt-32 pb-20 md:pt-40 md:pb-28">
                <div class="container mx-auto px-6 text-center relative z-10">
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                        We cut Shopify support tickets <span class="text-indigo-400">40%</span> in 30 days—without new hires.
                    </h1>
                    <p class="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-300">
                        Merchants using our AI bot save 11 hr/week and $1,240/month on support cost. Book a free 15-min audit to see how many tickets we can kill for you.
                    </p>
                    <div class="mt-10">
                        <a href="#audit-cal" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg transition text-lg transform hover:scale-105">
                            Get Free AI Audit (15 min)
                        </a>
                        <p class="mt-3 text-sm text-slate-400">"Saved 11 h/week on WISMO tickets" — Sarah, <a class="underline hover:text-indigo-300 transition" href="#">feelgoodstore.myshopify.com</a></p>
                    </div>
                </div>
            </section>

            <!-- Booking/Audit Section -->
            <section id="audit-cal" class="py-20 bg-slate-900/50">
                <div class="container mx-auto px-6">
                     <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div data-scroll-animate>
                            <h2 class="text-3xl md:text-4xl font-bold text-white">Book Your Free 15-Min AI Audit</h2>
                            <p class="mt-4 text-lg text-slate-400">Choose a time that works for you. We'll show you exactly how our AI can start saving you time and money.</p>
                            <!-- Removed testimonial card per request -->
                        </div>
                        <div data-scroll-animate style="transition-delay: 150ms;">
                             <div class="h-[650px] rounded-lg overflow-hidden border border-slate-700">
                                <iframe src="https://cal.com/tyler-kuchelmeister-e0drr4" style="width: 100%; height: 100%; border:0;" loading="lazy"></iframe>
                             </div>
                             <p class="mt-4 text-center text-sm text-slate-400 md:hidden">
                                Can't see the calendar? 
                                <a href="https://cal.com/tyler-kuchelmeister-e0drr4" target="_blank" rel="noopener noreferrer" class="underline hover:text-indigo-300">
                                    Click here to open it in a new tab.
                                </a>
                            </p>
                        </div>
                     </div>
                </div>
            </section>

            <!-- ROI Calculator Section -->
            <section id="roi-calculator" class="py-20 bg-gray-800/50">
                <div class="container mx-auto px-6">
                    <div class="max-w-3xl mx-auto text-center" data-scroll-animate>
                        <h2 class="text-3xl md:text-4xl font-bold text-white">See What You Could Save</h2>
                        <p class="mt-4 text-lg text-slate-400">
                            Our AI is trained for Shopify. Use the calculator to estimate your potential savings based on store averages.
                        </p>
                    </div>
                    <div class="mt-12 max-w-4xl mx-auto" data-scroll-animate style="transition-delay: 150ms;">
                        <div class="bg-slate-800 p-8 rounded-lg shadow-2xl">
                            <form id="roiForm">
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label for="tickets" class="block text-sm font-medium text-slate-300 mb-1">How many support tickets do you get per month?</label>
                                        <input type="number" id="tickets" value="1200" class="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500" required>
                                    </div>
                                    <div>
                                        <label for="hoursPerTicket" class="block text-sm font-medium text-slate-300 mb-1">How many agent hours does it take to close them?</label>
                                        <input type="number" id="hoursPerTicket" step="0.01" value="0.75" class="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500" required>
                                    </div>
                                    <div>
                                        <label for="wage" class="block text-sm font-medium text-slate-300 mb-1">Average hourly wage of support staff?</label>
                                        <input type="number" id="wage" value="22" class="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500" required>
                                    </div>
                                </div>
                            </form>
                            <div id="roiResults" class="mt-8 text-center bg-slate-900/50 p-6 rounded-lg">
                                <!-- Calculation will appear here -->
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Risk-Reversal Strip -->
            <section class="bg-slate-800/50 py-10">
                 <div class="container mx-auto px-6">
                    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:justify-evenly gap-x-8 gap-y-4 text-slate-300 text-center text-sm md:text-base">
                        <span class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            No-code install.
                        </span>
                        <span class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            30-day 'remove it or we refund' guarantee.
                        </span>
                        <span class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Keeps working even if you uninstall apps.
                        </span>
                    </div>
                </div>
            </section>
        </main>

        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

export default app
