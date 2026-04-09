# Awwzo Mission Control

AI-Powered Marketing Execution Dashboard for Awwzo.

## Deploy to Vercel (5 minutes)

### Step 1: Push to GitHub
1. Create a new repo on GitHub: `awwzo-mission-control` (make it PRIVATE)
2. Push this folder to that repo

### Step 2: Deploy on Vercel
1. Go to vercel.com → "Add New Project"
2. Import your GitHub repo
3. In "Environment Variables", add:
   - `ANTHROPIC_API_KEY` = your Anthropic API key (get from console.anthropic.com)
4. Click "Deploy"

### Step 3: Connect marketing.awwzo.com
1. In Vercel project → Settings → Domains
2. Add `marketing.awwzo.com`
3. Vercel will show you a CNAME record to add
4. Go to Squarespace DNS settings:
   - Squarespace → Settings → Domains → awwzo.com → DNS Settings
   - Add Custom Record:
     - Type: CNAME
     - Host: marketing
     - Data: cname.vercel-dns.com
5. Wait 5-10 minutes for DNS propagation
6. Vercel will auto-issue SSL certificate

### Login Credentials
- Email: marketing@awwzo.com  
- Password: (set in app/page.js - CHANGE BEFORE DEPLOYING)

### Changing Password
Edit `app/page.js` — find `VALID_EMAIL` and `VALID_PASS` near the top and update them.
