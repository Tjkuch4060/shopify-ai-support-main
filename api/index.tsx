// api/index.tsx
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import { kv } from '@vercel/kv'

export const config = { runtime: 'edge' }

type Lead = {
  id: string
  email: string
  name: string
  company: string
  monthlyTickets: number
  currentMonthlyCost: number
  potentialSavings: number
  phone: string
  source: string
  timestamp: string
  userAgent: string
  ipAddress: string
}

const app = new Hono()

// CORS
app.use('/api/*', cors())

// No JSX renderer; serve plain HTML from the landing route

// Health
app.get('/api/health', (c) => c.json({ status: 'ok' }))

// ROI calc
app.post('/api/roi-calculate', async (c) => {
  const b = await c.req.json().catch(() => ({}))
  const tickets = Number(b.tickets || 0)
  const hoursPerTicket = Number(b.hoursPerTicket || 0)
  const wage = Number(b.wage || 0)
  const totalMonthlyCost = tickets * hoursPerTicket * wage
  const monthlySavings = totalMonthlyCost * 0.4
  const roundedSavings = Math.round(monthlySavings)
  return c.json({ tickets, hoursPerTicket, wage, totalMonthlyCost, monthlySavings, roundedSavings })
})

// Capture lead → persist in KV
app.post('/api/capture-lead', async (c) => {
  const b = await c.req.json().catch(() => ({}))
  const id = crypto.randomUUID()
  const lead: Lead = {
    id,
    email: String(b.email || '').toLowerCase().trim(),
    name: String(b.name || '').trim(),
    company: String(b.company || '').trim(),
    monthlyTickets: Number(b.monthlyTickets || 0),
    currentMonthlyCost: Number(b.currentMonthlyCost || 0),
    potentialSavings: Number(b.potentialSavings || 0),
    phone: String(b.phone || '').trim(),
    source: String(b.source || 'web'),
    timestamp: new Date().toISOString(),
    userAgent: c.req.header('user-agent') || '',
    ipAddress: c.req.header('x-forwarded-for') || ''
  }

  // Store as hash + index id in a list for ordering
  await kv.hset(`lead:${id}`, lead as any)
  await kv.lpush('leads:ids', id)

  return c.json({ ok: true, id })
})

// List leads (paginated)
app.get('/api/leads', async (c) => {
  const page = Number(c.req.query('page') || 1)
  const size = Number(c.req.query('size') || 25)
  const start = (page - 1) * size
  const end = start + size - 1

  const total = await kv.llen('leads:ids')
  // lrange returns newest-first if we use lpush: index 0 is most recent
  const ids = await kv.lrange<string>('leads:ids', start, end)
  const leadsRaw = await Promise.all(ids.map((id) => kv.hgetall<Lead>(`lead:${id}`)))
  const leads = leadsRaw.filter(Boolean)

  return c.json({
    page,
    size,
    total,
    leads
  })
})

// Export CSV
app.get('/api/export.csv', async (c) => {
  const ids = await kv.lrange<string>('leads:ids', 0, -1)
  const leadsRaw = await Promise.all(ids.map((id) => kv.hgetall<Lead>(`lead:${id}`)))
  const rows = (leadsRaw.filter(Boolean) as Lead[]).map((x) => [
    x.id,
    x.timestamp,
    x.email,
    x.name,
    x.company,
    x.phone,
    x.source,
    x.monthlyTickets,
    x.currentMonthlyCost,
    x.potentialSavings,
    x.userAgent?.replace(/[\r\n]+/g, ' ').slice(0, 200),
    x.ipAddress
  ])

  const header = [
    'id',
    'timestamp',
    'email',
    'name',
    'company',
    'phone',
    'source',
    'monthlyTickets',
    'currentMonthlyCost',
    'potentialSavings',
    'userAgent',
    'ipAddress'
  ]

  const toCSV = (arr: string[][]) =>
    arr
      .map((cols) =>
        cols
          .map((v) => {
            const s = String(v ?? '')
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
          })
          .join(',')
      )
      .join('\n')

  const body = [header, ...rows].map((r) => r.map(String)) as unknown as string[][]
  const csv = toCSV(body)

  return new Response(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`
    }
  })
})

// Landing
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="/static/style.css" rel="stylesheet" />
      <title>AI Support Bot</title>
    </head>
    <body class="min-h-screen bg-slate-950 text-slate-200">
      <main>
        <section class="py-16">
          <div class="container mx-auto px-6">
            <h1 class="text-4xl font-bold text-white">AI Support for Shopify</h1>
            <p class="mt-4 text-slate-300">Cut response time and ticket load. See your ROI below.</p>
            <a href="#roi" class="mt-8 inline-block rounded-md bg-indigo-500 px-4 py-2 text-white">Calculate ROI</a>
          </div>
        </section>
        <section id="roi" class="py-16 bg-slate-900/50">
          <div class="container mx-auto px-6">
            <div id="roi-app" class="text-slate-200"></div>
          </div>
        </section>
      </main>
      <script src="/static/app.js" defer></script>
    </body>
  </html>`)
})

// Fallback
app.all('*', (c) => c.redirect('/'))

export default handle(app)
