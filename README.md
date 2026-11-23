# ResuMatch AI 🎯

> Intelligent Resume ATS Matcher & Career Gap Analyzer built with Next.js 16, Tailwind CSS, and Google Gemini Multimodal AI.

ResuMatch AI bridges the gap between job seekers and Applicant Tracking Systems (ATS). Instead of relying on fragile keyword-scraping or legacy PDF text extraction, ResuMatch AI utilizes **native multimodal document understanding** to parse CV layouts, structural hierarchies, and job requirements simultaneously. It delivers an objective match score, pinpoints competency gaps, drafts tailored portfolio bullet points, and provides strategic interview talking points.

---

## 🌟 Key Features

- **Native Multimodal PDF Processing**: Upload raw PDF resumes directly. Document layout, tables, and typography are interpreted natively by Google Gemini without relying on external PDF worker processes.
- **ATS Match Score & Category Breakdown**: Detailed scoring across Technical Skills, Experience Relevance, and Qualifications.
- **Skill Alignment Mapping**: Side-by-side visualization of matching competencies versus missing requirements.
- **Actionable Upskilling Roadmap**: Prioritized learning path (High/Medium priority) with realistic timelines (e.g., *3–5 days*, *1–2 weeks*) and specific hands-on project ideas.
- **ATS-Ready Resume Bullet Points**: Ready-to-copy accomplishment statements with a 1-click clipboard utility to immediately boost resume relevance.
- **Interview & Screening Defense**: Tailored strategies and sample responses for navigating tricky recruiter screening questions regarding missing skills.
- **Multi-Model High-Availability Fallback**: Backend architecture with automatic failover across Gemini Flash Lite endpoints to prevent downtime during upstream demand spikes.
- **Clean Printable Reports**: Built-in print stylesheet to export the evaluation report directly to clean PDF format.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI Engine**: [Google Gemini Multimodal API](https://aistudio.google.com/) via [Vercel AI SDK](https://sdk.vercel.ai/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/Gbrnd-ux/resumatch-ai.git
cd resumatch-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
resumatch-ai/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts         # Multimodal AI analysis endpoint with model failover
│   ├── globals.css              # Global styles & print media rules
│   ├── layout.tsx               # Root layout & metadata
│   └── page.tsx                 # Main application interface & upload workflow
├── components/
│   ├── ui/                      # Base interface elements
│   └── ResultCard.tsx           # Interactive evaluation dashboard with tabs & copy actions
├── lib/
│   └── utils.ts                 # Classname merge helpers
├── next.config.ts               # Next.js configuration
├── package.json
└── tsconfig.json
```

---

## 🛡️ Architecture & Design Decisions

### Why Native Multimodal over Local PDF Parsers?
Standard Node.js PDF parsers (such as `pdfjs-dist` or `pdf-parse`) frequently encounter issues in serverless and modern bundler runtimes (Turbopack worker path resolution, lack of native canvas bindings, and incompatibility with modern PDF 1.5+ XRef Streams). 

By streaming the raw file buffer directly to Gemini's native multimodal pipeline (`mediaType: 'application/pdf'`), ResuMatch AI eliminates native compilation dependencies, handles scanned and multi-column documents seamlessly, and yields significantly higher semantic accuracy.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👤 Author

Developed by **[Gbrnd-ux](https://github.com/Gbrnd-ux)**
