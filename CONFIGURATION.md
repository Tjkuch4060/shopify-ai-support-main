# 🔧 Configuration Guide - AI Support Bot Landing Page

## 📋 **Environment Files Created**

Your project now includes comprehensive environment configuration:

### **`.env`** - Local Development
```bash
# Your actual Cloudflare API token is already configured
CLOUDFLARE_API_TOKEN=j-qNw7uQiJYeuVFA5ht5hffnnxls8IYv_iiD5QbA

# Update these with your actual IDs:
META_PIXEL_ID=YOUR_META_PIXEL_ID_HERE
GOOGLE_ANALYTICS_ID=YOUR_GOOGLE_TAG_ID_HERE

# Business configuration (update with your details):
COMPANY_NAME=Lumin Agency
FOUNDER_NAME=Tyler Kuchelmeister
CALENDAR_URL=https://cal.com/tyler-kuchelmeister-e0drr4
```

### **`.env.example`** - Template for team members
- Safe to commit to Git
- Shows required variables without sensitive values

### **`.dev.vars`** - Cloudflare Pages development
- Used by `wrangler pages dev` for local development

---

## 🎯 **Quick Configuration Methods**

### **Method 1: Automated Configuration (Recommended)**

Use the configuration script to generate a personalized deployment file:

```bash
cd /home/user/webapp

# Generate configured deployment file
node config-replacer.js \
  --company "Your Company Name" \
  --founder "Your Full Name" \
  --pixel "123456789012345" \
  --ga "G-XXXXXXXXXX" \
  --calendar "https://cal.com/your-username"

# This creates DEPLOY-READY.html with your settings
```

### **Method 2: Manual Environment Setup**

Update your `.env` file with actual values:

1. **Open `.env` file**
2. **Replace these values:**
   ```bash
   META_PIXEL_ID=your_actual_pixel_id
   GOOGLE_ANALYTICS_ID=your_actual_ga_id
   COMPANY_NAME=Your Company Name
   FOUNDER_NAME=Your Full Name
   CALENDAR_URL=https://cal.com/your-username
   ```

3. **Generate configured file:**
   ```bash
   node config-replacer.js
   ```

---

## 📊 **Where to Get Your IDs**

### **Meta Pixel ID (Facebook/Instagram Ads)**
1. **Go to:** https://business.facebook.com/events_manager
2. **Select your pixel** or create new one
3. **Copy Pixel ID** (15-16 digits like `123456789012345`)

### **Google Analytics 4 ID**
1. **Go to:** https://analytics.google.com
2. **Admin → Property Settings → Property Details**
3. **Copy Measurement ID** (starts with `G-` like `G-XXXXXXXXXX`)

### **Cal.com Calendar URL**
1. **Go to:** https://cal.com/your-username
2. **Copy your booking page URL**
3. **Format:** `https://cal.com/your-username` or custom URL

---

## 🚀 **Deployment Options with Configuration**

### **Option 1: Single File Deployment**
```bash
# Generate configured file
node config-replacer.js --company "Your Company" --founder "Your Name" --pixel "123456789" --ga "G-ABCD123"

# Deploy DEPLOY-READY.html to:
# - Netlify Drop: https://app.netlify.com/drop
# - Vercel: https://vercel.com/new
# - GitHub Pages: Enable in repository settings
```

### **Option 2: GitHub Pages with Actions**
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure deployment
        run: |
          node config-replacer.js \
            --company "${{ secrets.COMPANY_NAME }}" \
            --founder "${{ secrets.FOUNDER_NAME }}" \
            --pixel "${{ secrets.META_PIXEL_ID }}" \
            --ga "${{ secrets.GOOGLE_ANALYTICS_ID }}" \
            --calendar "${{ secrets.CALENDAR_URL }}"
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
          publish_branch: gh-pages
```

### **Option 3: Netlify with Environment Variables**
1. **Connect GitHub repo** to Netlify
2. **Set environment variables** in Netlify dashboard:
   - `COMPANY_NAME`
   - `FOUNDER_NAME` 
   - `META_PIXEL_ID`
   - `GOOGLE_ANALYTICS_ID`
   - `CALENDAR_URL`
3. **Build command:** `node config-replacer.js`
4. **Publish directory:** `.`

---

## 🔒 **Security Best Practices**

### **✅ Safe to Commit:**
- `.env.example`
- `config-replacer.js`
- `DEPLOY-CONFIGURABLE.html` (template)
- `CONFIGURATION.md`

### **❌ Never Commit:**
- `.env` (contains actual API tokens)
- `.dev.vars` (contains development secrets)
- `DEPLOY-READY.html` (contains configured IDs)

### **🛡️ Production Secrets:**
- **Cloudflare Pages:** Set environment variables in dashboard
- **Netlify:** Use environment variables in site settings
- **Vercel:** Configure environment variables in project settings

---

## 🎯 **Testing Your Configuration**

After deploying configured version:

### **1. Test Analytics Tracking:**
```javascript
// Open browser console (F12) and check for:
console.log('Meta Pixel loaded:', typeof fbq !== 'undefined');
console.log('Google Analytics loaded:', typeof gtag !== 'undefined');
```

### **2. Test ROI Calculator:**
- Enter test values: 1200 tickets, 0.75 hours, $22 wage
- Should show: "You're burning $19,800" and "Save $7,920"
- Click "Get Custom Report" to test lead capture

### **3. Test Calendar Integration:**
- Verify Cal.com iframe loads
- Test booking a time slot
- Ensure correct calendar URL

### **4. Test Mobile Experience:**
- Responsive design on phone/tablet
- Mobile menu functionality
- Touch interactions work

---

## 🎉 **Next Steps**

1. **Configure your environment** using Method 1 or 2 above
2. **Generate deployment file** with `node config-replacer.js`
3. **Deploy to your preferred platform**
4. **Test all features** on live site
5. **Monitor analytics** for conversion tracking
6. **Optimize based on data** collected

---

## 🆘 **Troubleshooting**

### **Config Script Not Working:**
```bash
# Ensure Node.js is available
node --version

# Run with explicit path
node ./config-replacer.js

# Check file permissions
ls -la config-replacer.js
```

### **Analytics Not Tracking:**
- Verify IDs are correct format
- Check browser console for errors
- Test in incognito mode
- Allow 24-48 hours for data to appear

### **Calendar Not Loading:**
- Verify Cal.com URL is accessible
- Check for CORS/iframe restrictions
- Test URL directly in browser

Your enhanced landing page is now ready for production with full configuration management! 🚀