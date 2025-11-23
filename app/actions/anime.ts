"use server";

import { prisma } from "@/lib/prisma";

// 1. Arama Fonksiyonu (Search Modal için)
export async function searchAnime(query: string) {
  if (!query || query.length < 2) return [];

  try {
    const results = await prisma.anime.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        type: true,
        year: true,
        rating: true,
      },
      take: 5,
      orderBy: {
        rating: 'desc',
      },
    });
    return results;
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}

// 2. Dashboard İstatistikleri (Admin Paneli için)
export async function getDashboardStats() {
  try {
    const [userCount, animeCount, episodeCount, totalViews] = await Promise.all([
      prisma.user.count(),
      prisma.anime.count(),
      prisma.episode.count(),
      // WatchHistory tablosu varsa say, yoksa 0 dön
      prisma.watchHistory ? prisma.watchHistory.count() : 0, 
    ]);

    return {
      userCount,
      animeCount,
      episodeCount,
      totalViews
    };
  } catch (error) {
    console.error("Stats Error:", error);
    return { userCount: 0, animeCount: 0, episodeCount: 0, totalViews: 0 };
  }
}