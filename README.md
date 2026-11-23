# AI Resume Analyzer

Aplikasi web untuk menganalisis kesesuaian CV dengan Job Description menggunakan AI (GPT-4o-mini).

## Fitur

- 📄 Upload CV dalam format PDF
- 📝 Paste Job Description
- 🤖 Analisis AI yang mendalam
- 📊 Match Score (0-100)
- ✅ Daftar skill yang cocok
- ❌ Daftar skill yang kurang
- 💡 Saran perbaikan CV yang actionable

## Tech Stack

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS + Shadcn UI
- **AI:** Vercel AI SDK + OpenAI GPT-4o-mini
- **PDF Parser:** pdf-parse
- **Validation:** Zod

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Buat file `.env.local` di root project:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Dapatkan API key dari: https://platform.openai.com/api-keys

### 3. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Cara Penggunaan

1. **Upload CV:** Klik area upload dan pilih file PDF CV Anda
2. **Paste Job Description:** Copy-paste deskripsi pekerjaan yang ingin Anda lamar
3. **Klik "Analyze CV":** Tunggu beberapa detik untuk proses analisis
4. **Lihat Hasil:** 
   - Match Score menunjukkan tingkat kesesuaian (0-100)
   - Skill yang cocok ditampilkan dengan badge hijau
   - Skill yang kurang ditampilkan dengan badge merah
   - Tips perbaikan untuk meningkatkan CV Anda

## Scoring Guide

- **90-100:** Sangat Sesuai - Kandidat ideal
- **75-89:** Sesuai - Kandidat kuat
- **60-74:** Cukup Sesuai - Layak dipertimbangkan
- **40-59:** Kurang Sesuai - Banyak gap
- **0-39:** Tidak Sesuai - Gap signifikan

## Project Structure

```
ai-resume-analyzer/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # API endpoint untuk analisis
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Halaman utama
├── components/
│   ├── ui/                       # Shadcn UI components
│   └── ResultCard.tsx            # Komponen hasil analisis
└── lib/
    └── utils.ts                  # Utility functions
```

## Error Handling

Aplikasi menangani berbagai error:
- File bukan PDF
- PDF kosong atau terenkripsi
- Job Description kosong
- API key tidak valid
- Timeout atau network error

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Deploy

Deploy dengan mudah menggunakan Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Jangan lupa set environment variable `OPENAI_API_KEY` di Vercel Dashboard.

## License

MIT

## Author

Built with ❤️ by Gbrnd-ux
