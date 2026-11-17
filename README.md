# CS4001NI Java Revision Quiz

A static quiz site with a Netlify Function that forwards submissions to Discord.

## Deploy to Netlify

1. Push this folder to a Git repository and import that repository in Netlify, or deploy with the Netlify CLI (`netlify deploy --prod`). A Git/CLI deploy is required so the Netlify Function is deployed along with the site.
2. In Netlify, open **Site configuration → Environment variables**.
3. Add an environment variable:
   - Key: `DISCORD_WEBHOOK_URL`
   - Value: your Discord webhook URL
4. Redeploy the site after setting the variable.

The webhook URL is intentionally not stored in the browser code or in this project. Do not commit it to Git.

## Important security notes

- The webhook URL was shared in the setup conversation. For safety, regenerate/rotate that webhook in Discord before deploying, then use the new URL as the Netlify environment variable.
- This is a public quiz endpoint. The webhook URL stays server-side, but a public visitor could still repeatedly submit requests. For a class-only/high-stakes assessment, add authentication or a server-side access code and rate limiting.
- Student name and email are personal information. Tell students that their submission is sent to your Discord server and restrict access to that channel.

## Contents

- `index.html` — page structure
- `styles.css` — responsive styling
- `app.js` — quiz questions and browser interaction
- `netlify/functions/submit.js` — server-side Discord delivery
- `netlify.toml` — Netlify configuration
