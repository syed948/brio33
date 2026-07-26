# Brio3 — Voice. ICP. Data. One agent.

Marketing site for Brio3: static HTML/CSS/JS, no build step.

## Pages
index.html · how-it-works.html · pricing.html · about.html · privacy.html · terms.html

## Test call widget
The homepage test call runs a simulated preview by default. To place real calls,
set `TEST_CALL_ENDPOINT` at the top of `assets/main.js` to your telephony backend
(POST endpoint receiving `{ name, company, phone }`).

## Deploy
Static site — deploys on Vercel with zero configuration (Framework preset: Other).
