import { NextRequest, NextResponse } from 'next/server';
import { syncService } from '@/services/syncService';
import { Anime } from '@/types';

// MOCK DATABASE FETCHER
const getAiringAnimeFromDB_MOCK = async (): Promise<Anime[]> => {
  return [
    {
      id: '1',
      title: 'One Piece',
      episodes: 1090,
      status: 'Airing',
      description: '', imageUrl: '', tags: [], rating: 0, type: 'TV', sub: 0, duration: ''
    },
    {
      id: '2',
      title: 'Jujutsu Kaisen 2nd Season',
      episodes: 23,
      status: 'Airing',
      description: '', imageUrl: '', tags: [], rating: 0, type: 'TV', sub: 0, duration: ''
    }
  ];
};

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    if (process.env.NODE_ENV !== 'development') {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  try {
    const airingAnimeList = await getAiringAnimeFromDB_MOCK();
    const updates: string[] = [];
    console.log(`[CRON] Starting update check for ${airingAnimeList.length} series...`);

    for (const anime of airingAnimeList) {
      // NOTE: The user requested a change to syncEpisodes, but the existing code uses syncService.syncEpisodes
      // To match the existing code's logic, we use the syncService instance.
      const result = await syncService.syncEpisodes(anime.title);

      if (result.success && result.episodes.length > 0) {
        const remoteCount = result.episodes.length;
        const localCount = anime.episodes;
        if (remoteCount > localCount) {
          const newEpisodesCount = remoteCount - localCount;
          updates.push(`${anime.title}: +${newEpisodesCount} new eps (Total: ${remoteCount})`);
          console.log(`[UPDATE] ${anime.title} updated to ${remoteCount} episodes.`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      checked: airingAnimeList.length,
      updates: updates
    });

  } catch (error) {
    console.error('[CRON_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}