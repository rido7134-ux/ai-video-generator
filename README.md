# AI Video Generator (Enhanced)

This project is an enhanced AI Text-to-Video generator ready for Vercel deployment.

## Features added
- Modern UI with Tailwind (via CDN)
- Download button for generated video
- Serverless proxy (Vercel) that uses HF_API_KEY from environment variables so frontend does not need the key
- Multiple styles (cinematic, anime, horror, romantic, realistic)
- Loader animation and state
- Dark/Light toggle
- Gallery (saved in localStorage) with delete and copy-prompt
- About & Contact sections

## How to deploy on Vercel
1. Create a new project on Vercel and upload this repository (or connect GitHub).
2. In Project Settings -> Environment Variables, add `HF_API_KEY` with your HuggingFace API Key.
3. Deploy. The serverless function `api/generate.js` will proxy requests to Hugging Face.

## Notes
- If you prefer a truly keyless public deployment, consider using a free public inference endpoint (if available) or hosting your own model. Public endpoints often have limits.
- You can tweak `api/generate.js` to call another provider (Replicate, ModelScope) if you have their keys.
