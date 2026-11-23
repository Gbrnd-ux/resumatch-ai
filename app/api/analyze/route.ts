import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const jobDescription = formData.get('jobDescription') as string;

    if (!file || !jobDescription) {
      return Response.json({ error: 'File dan Job Description wajib diisi' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();

    const systemPrompt = `Anda adalah Senior Tech Recruiter & Principal Software Engineer dengan pengalaman 15+ tahun.
Tugas Anda adalah membedah CV kandidat terhadap Job Description/Pertanyaan Skrining dengan sangat detail, kritis, dan memberikan solusi konkret yang langsung bisa dieksekusi.

KEMBALIKAN HANYA FORMAT JSON MURNI TANPA KUTIP MARKDOWN (\`\`\`json).
Struktur JSON yang WAJIB dipenuhi:
{
  "matchScore": number (0-100),
  "potentialScore": number (estimasi skor jika kandidat menerapkan action plan utama, misal 85-95),
  "summary": "Ringkasan evaluasi HRD 2-3 kalimat: posisi kandidat saat ini dan alasan utama skor tersebut.",
  "categoryScores": {
    "technicalSkills": number (0-100),
    "experienceFit": number (0-100),
    "educationAndCulture": number (0-100)
  },
  "matchingSkills": ["skill yang cocok 1", "skill yang cocok 2"],
  "missingSkills": ["skill yang kurang 1", "skill yang kurang 2"],
  "actionPlan": [
    {
      "priority": "Tinggi" | "Sedang",
      "skill": "Nama Skill / Bidang",
      "whyItMatters": "Alasan detail mengapa lowongan ini sangat membutuhkan skill ini",
      "howToLearn": "Langkah konkret & cara cepat menguasainya (tools/framework/proyek yang perlu dibuat)",
      "estimatedTime": "Estimasi waktu (misal: 1-2 Minggu, 3-5 Hari)"
    }
  ],
  "cvBulletPointsToAdd": [
    "Contoh kalimat poin portofolio/pengalaman kerja konkret siap pakai di CV untuk mendongkrak skor ATS"
  ],
  "interviewTips": [
    {
      "question": "Pertanyaan skrining/interview terkait skill yang kurang",
      "answerStrategy": "Cara cerdas menjawabnya agar HRD tetap terkesan dan yakin merekrut Anda"
    }
  ]
}`;

    // Hanya gunakan model-model Flash Lite yang stabil, tidak terkena 503 high demand,
    // dan responsif dalam 2-5 detik. Hindari gemini-3.5-flash yang sering overload.
    const models = [
      'gemini-3.5-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-3.1-flash-lite-preview',
    ];
    let textResponse = '';
    let lastError: any = null;

    for (const modelName of models) {
      try {
        const { text } = await generateText({
          model: google(modelName),
          system: systemPrompt,
          maxRetries: 0,
          abortSignal: AbortSignal.timeout(60000), // Berikan waktu 60s (cukup untuk analisis komprehensif ~20-25s)
          messages: [
            {
              role: 'user',
              content: [
                { type: 'file', data: arrayBuffer, mediaType: 'application/pdf' },
                { type: 'text', text: `Berikut adalah Job Description / Pertanyaan Skrining:\n\n${jobDescription}\n\nTolong lakukan analisis mendalam dan berikan solusi sedetail mungkin.` },
              ],
            },
          ],
        });
        textResponse = text;
        break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} gagal atau timeout, beralih ke cadangan...`, err?.message || err);
      }
    }

    if (!textResponse) {
      throw lastError || new Error('Gagal menghubungi AI service');
    }

    // Bersihkan formatting markdown jika ada
    const cleanJson = textResponse.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const parsedObject = JSON.parse(cleanJson);

    return Response.json(parsedObject);
  } catch (error: any) {
    console.error('Error API:', error);
    return Response.json(
      { error: error?.message || 'Gagal memproses file. Pastikan PDF valid.' },
      { status: 500 }
    );
  }
}
