import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // @ işareti proje ana dizinini temsil eder
import { syncEpisodes } from "@/services/syncService"; 

// Vercel Cron Job için GET isteği
export async function GET() {
  try {
    // 1. Devam eden (AIRING) animeleri bul
    const airingAnimes = await prisma.anime.findMany({
      where: {
        status: "AIRING",
      },
    });

    if (airingAnimes.length === 0) {
      return NextResponse.json({ message: "No airing animes found." });
    }

    // 2. Her biri için senkronizasyon servisini çalıştır
    const results = await Promise.allSettled(
      airingAnimes.map((anime) => syncEpisodes(anime.id))
    );

    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const failCount = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      success: true,
      message: `Sync complete. Success: ${successCount}, Failed: ${failCount}`,
    });
  } catch (error) {
    console.error("Cron Job Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}