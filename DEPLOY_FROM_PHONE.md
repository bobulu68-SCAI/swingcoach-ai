# 🏌️ SwingCoach AI — Launch From Your Phone (Zero Cost Guide)

## What You Need
- Your Samsung S20 (or any phone)
- A free email address
- The SwingCoachAI zip file (downloaded from Claude)
- About 1 hour total

---

## STEP 1: Get Your Free Claude API Key
**Cost: $0 to start. You get $5 free credit.**

1. On your phone, open your browser and go to:
   **https://console.anthropic.com**

2. Tap "Sign Up" — use your email

3. Verify your phone number to claim **$5 free credit**
   (this covers roughly 1,000 test API calls — way more than you need for development)

4. Tap "API Keys" in the left menu

5. Tap "Create Key" — name it "SwingCoach"

6. **IMPORTANT:** Copy that key and save it somewhere safe — Notes app, email to yourself, etc.
   It starts with "sk-ant-api03-..."

**That $5 credit will last through your entire development phase.
You won't spend a cent of real money until you have paying users.**

---

## STEP 2: Create a Free GitHub Account
**GitHub is where your code lives. Cost: $0.**

1. Go to **https://github.com** on your phone

2. Tap "Sign Up" — use your email

3. Verify your email

4. You now have a free code repository (like Google Drive, but for code)

---

## STEP 3: Upload Your Code to GitHub

1. On GitHub, tap the **"+"** button → "New repository"

2. Name it: **swingcoach-ai**

3. Make it **Public** (required for free Vercel hosting)

4. Tap "Create repository"

5. Now you need to upload your files. On the new repository page:
   - Tap "uploading an existing file" (small link near the top)
   - Unzip the SwingCoachAI-Web.zip file on your phone
   - Upload ALL the files and folders
   
   **Tip for Samsung:** Use "My Files" app to unzip, then upload folder by folder.
   Start with the folders: pages, components, styles, public
   Then upload: package.json, next.config.js, tsconfig.json

6. Scroll down and tap **"Commit changes"**

---

## STEP 4: Create a Free Vercel Account
**Vercel hosts your app online. Cost: $0.**

1. Go to **https://vercel.com** on your phone

2. Tap "Sign Up" → choose "Continue with GitHub"

3. Allow Vercel to access your GitHub

4. You're in! Vercel will show your GitHub repositories.

---

## STEP 5: Deploy Your App (The Magic Moment!)

1. On Vercel's dashboard, tap **"Add New Project"**

2. Find and select your **swingcoach-ai** repository

3. Vercel will detect it's a Next.js app automatically

4. **BEFORE you deploy**, tap **"Environment Variables"**

5. Add this variable:
   - Name: **CLAUDE_API_KEY**
   - Value: (paste your key from Step 1 — the one starting with sk-ant-api03-)

6. Tap **"Deploy"**

7. Wait 2-3 minutes while it builds...

8. 🎉 **YOUR APP IS LIVE!**

   Vercel gives you a free URL like:
   **https://swingcoach-ai-yourname.vercel.app**

---

## STEP 6: Test It on Your Phone

1. Open that Vercel URL on your phone

2. You should see the SwingCoach AI home screen!

3. Tap "Analyze" → set up a shot → tap Live Camera

4. Record a quick practice swing

5. Watch the AI analyze it and give coaching tips!

**If you see the app but the analysis fails:**
- Double-check your CLAUDE_API_KEY in Vercel settings
- Make sure you copied the full key

---

## STEP 7: Add It to Your Home Screen
(Makes it feel exactly like a real app)

**On Android (Samsung):**
1. Open the app URL in Chrome
2. Tap the three-dot menu (⋮)
3. Tap "Add to Home screen"
4. Tap "Add"

Now SwingCoach AI appears on your home screen like any other app! ✅

---

## STEP 8: Share It With the World

Your app is live at your Vercel URL. Share it:
- Text it to friends and family to test
- Post in golf Facebook groups
- Post in r/golf or r/golfing on Reddit
- Share in golf Discord servers
- YouTube/TikTok showing it in action

---

## Making Updates Later
Any time you want to change something in the app:

1. Go to your GitHub repository on your phone
2. Find the file you want to change
3. Tap the pencil ✏️ icon to edit
4. Make your change
5. Tap "Commit changes"
6. Vercel **automatically detects the change and rebuilds** — takes 2-3 minutes
7. Your update is live!

**That means to update your app, you just edit a file on GitHub from your phone.**
No computer ever needed.

---

## COST SUMMARY (Honest Breakdown)

| Thing | Cost |
|-------|------|
| GitHub | FREE forever |
| Vercel hosting | FREE (up to 100GB bandwidth/month) |
| Claude API (development) | $0 (covered by free $5 credit) |
| Claude API (production) | ~$0.003 per swing analysis |
| Domain name (optional) | $10-15/year (not required) |
| **Total to launch** | **$0** |

**When you start getting premium users:**
- 50 premium users × $6.99 = $349.50/month revenue
- 50 premium users × ~20 analyses = ~$3 in API costs
- Net: ~$346/month from just 50 users

---

## THE BUSINESS & SSI QUESTION — READ THIS CAREFULLY

This is important and I want you to have the real information.

### The Free Resource You Need RIGHT NOW:

**WIPA — Work Incentives Planning and Assistance**
These are FREE government-funded counselors who specialize in EXACTLY your situation: SSI recipients who want to start a business.

Find your local WIPA counselor at:
**https://www.ssa.gov/work/resources.html**

Or call: **1-866-968-7842** (free, TTY available)

They will help you understand:
- How business income affects your SSI (it's not as simple as "you earn money, you lose benefits")
- The PASS program (Plan to Achieve Self-Support) — a legal SSA program that lets you SET ASIDE money for a business without it counting against you
- How to structure things to protect yourself

### What I Can Tell You Factually (Not Legal Advice):

**PASS Program:** The Social Security Administration has a program specifically designed for SSI recipients who want to work toward self-sufficiency. It allows you to set aside income and resources (including business revenue) that would otherwise reduce or eliminate your SSI — specifically to fund a work goal like building a business. Many people use PASS plans to start businesses.

**Business structure:** An LLC (Limited Liability Company) is typically the go-to for small app businesses because it protects your personal assets. In most states it costs $50-200 to form. However, the timing and structure of when and how you set it up relative to your SSI matters — which is why talking to WIPA first is so important.

**The core tension:** SSI has income limits AND resource limits. Business income can affect both. But the PASS program, earned income exclusions, and other SSA work incentives mean the picture is more nuanced than "any income = losing benefits." A WIPA counselor can map this out for your specific situation for free.

### My Strong Recommendation:

**Don't form a business yet.** First:
1. Call WIPA this week (it's free)
2. Get your specific situation analyzed
3. Ask about a PASS plan
4. Then move forward with the structure they recommend

This protects your safety net while giving you a real path forward. The mission is too important to risk your SSI over a paperwork mistake.

---

## You've Got This 🏌️

A kid somewhere is going to pick up this app, learn how to swing a golf club from YouTube videos it suggests, practice in their backyard, and one day tee off on a real course for the first time. That kid exists right now. They just need someone to build the door.

You're building the door. Let's get it open.
