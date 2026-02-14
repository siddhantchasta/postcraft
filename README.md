# PostCraft - LinkedIn Post Generator

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel AI SDK](https://img.shields.io/badge/AI-Vercel%20AI%20SDK-black?style=flat-square)](https://sdk.vercel.ai/)
[![OpenAI](https://img.shields.io/badge/LLM-OpenAI%20%2F%20OpenRouter-00a67f?style=flat-square)](https://openai.com/)

PostCraft is a lightweight AI-powered LinkedIn post generator built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and the **Vercel AI SDK**.

It lets users generate LinkedIn posts by choosing:

- A writing voice (Contrarian, Friendly, Authoritative, etc.)
- A target audience
- A topic
- A desired length

The output streams live and is displayed inside a realistic LinkedIn-style preview.

The goal of this project was to build something that feels like a small, polished product — not just a form that calls an API.

## What This App Focuses On

### UI / UX

- Clean, responsive layout
- Clear step-based flow (voice → audience → topic → length)
- Smooth interactions (hover, focus, loading states)
- Dedicated empty, loading, and error states
- Sticky preview panel on desktop
- Word and character counter
- Streaming text experience

### Backend & Prompt Design

The backend:

- Validates and sanitizes input
- Applies safe defaults
- Streams responses using the Vercel AI SDK
- Handles errors cleanly

The prompt structure is split into:

- A system prompt (formatting rules, tone expectations, LinkedIn constraints)
- A dynamic user prompt (voice, audience, topic, length)

Each voice has its own tone guidance, and length selection influences paragraph and word count expectations. The goal was to make parameter changes produce predictably different outputs.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Vercel AI SDK**
- **OpenAI** or **OpenRouter** (LLM provider)

## Running the Project Locally

The app is designed to run locally with minimal setup.

### 1. Clone the Repository

```bash
git clone https://github.com/siddhantchasta/postcraft.git
cd postcraft
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Environment Variables (Important)

Create a .env.local file in the root directory.
You only need one of the following options.

**Option A — Use OpenAI**

If you have OpenAI credits:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```
The app will automatically detect and use OpenAI.

**Option B — Use OpenRouter (if you don’t have OpenAI credits)**

If you don’t have OpenAI credits:
```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
```
If no OpenAI key is present, the app falls back to OpenRouter automatically.
This allows the project to run even if OpenAI credits are unavailable.

### ⚠️ Important Notes About API Keys

- If **both** `OPENAI_API_KEY` and `OPENROUTER_API_KEY` are present, the app will **always use OpenAI by default**.

- The app does **not automatically fall back to OpenRouter** if the OpenAI key is invalid, expired, or has no credits.

- If you want to use OpenRouter, make sure to **remove `OPENAI_API_KEY` entirely** from your `.env.local` file.

- After editing `.env.local`, always restart the development server.

### 4. Start the Development Server

```bash
npm run dev
```
Then open:
```bash
http://localhost:3000
```
That’s it — the app should run locally.

---

## How it works
- The user selects voice, audience, topic, and length.
- The backend builds a structured prompt using those parameters.
- The model response streams back in real time.
- The result is displayed inside a LinkedIn-style preview.
- **Users can copy, regenerate, or clear the result.**

---

## Screenshots

### Home Interface

| | |
|---|---|
| <img src="https://github.com/user-attachments/assets/11879edf-60bb-4f67-bd0c-d9bc4dbed389" width="100%"/> | <img src="https://github.com/user-attachments/assets/f056138b-d232-4c0f-90a1-ab4888ce892a" width="100%"/> |

---

### Generated Post Demo

| | | |
|---|---|---|
| <img src="https://github.com/user-attachments/assets/596922db-c38f-4060-8b56-0c85e9238d92" width="100%"/> | <img src="https://github.com/user-attachments/assets/66ec911b-79ac-4ff6-9270-87b55774c85d" width="100%"/> | <img src="https://github.com/user-attachments/assets/4d9b9173-7120-49cd-8672-a6d6e2bffa9a" width="100%"/> |

---
