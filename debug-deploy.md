# 🔍 Deployment Debugging Guide

## Current Status: 522 Connection Timeout

Your deployment at `https://lumin-ai-support-bot.pages.dev` is returning a 522 error, which means Cloudflare can't connect to the worker.

## Debugging Steps:

### 1. Check Cloudflare Dashboard
Go to: https://dash.cloudflare.com/pages
- Look for your `lumin-ai-support-bot` project
- Check the **Deployments** tab for any error messages
- Look at the **Functions** tab for worker logs

### 2. Common 522 Fixes:

#### Option A: Re-deploy with Clean Build
```bash
cd /home/user/webapp
rm -rf dist/
npm run build
# Then re-upload dist/ folder via dashboard
```

#### Option B: Check Worker Compatibility
The issue might be with the Hono worker. Try this minimal test:

Create a simple `test-worker.js`:
```javascript
export default {
  async fetch(request) {
    return new Response('Hello World', { status: 200 });
  }
}
```

#### Option C: Check Build Output
Verify these files exist in your upload:
- `_worker.js` (41KB) ✅ 
- `_routes.json` ✅
- `static/app.js` ✅
- `static/style.css` ✅

### 3. Alternative: Simplified Deployment

If the Hono worker is causing issues, I can create a static version that still captures leads via form submissions to external services.

## Quick Test Commands:

```bash
# Test after 10 minutes
curl -I https://lumin-ai-support-bot.pages.dev

# Check if it's a regional issue
curl -I https://lumin-ai-support-bot.pages.dev --resolve lumin-ai-support-bot.pages.dev:443:1.1.1.1

# Test from different location
curl -I https://lumin-ai-support-bot.pages.dev -H "CF-IPCountry: US"
```

## Expected Resolution Time:
- **Propagation delays:** 5-15 minutes
- **Configuration fixes:** 2-5 minutes  
- **Re-deployment:** 3-10 minutes

## Status Check:
Visit https://lumin-ai-support-bot.pages.dev every 5 minutes until it loads.