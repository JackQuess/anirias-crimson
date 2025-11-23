import { NextRequest, NextResponse } from 'next/server';
import { syncService } from '../../services/syncService';
import { Anime } from '../../../types';

// --- MOCK DATABASE FETCHER ---
// In a real app, this would be: await db.anime.findMany({ where: { status: 'Airing' } });
const getAiringAnimeFromDB_MOCK = async (): Promise<Anime[]> => {
  return [
    {
      id: '1',
      title: 'One Piece',
      episodes: 1090, // Local DB has 1090
      status: 'Airing',
      // ... other fields irrelevant for this check
      description: '', imageUrl: '', tags: [], rating: 0, type: 'TV', sub: 0, duration: ''
    },
    {
      id: '2',
      title: 'Jujutsu Kaisen 2nd Season',
      episodes: 23,
      status: 'Airing',
      // ...
      description: '', imageUrl: '', tags: [], rating: 0, type: 'TV', sub: 0, duration: ''
    }
  ];
};

export async function GET(req: NextRequest) {
  // 1. SECURITY CHECK
  // Vercel automatically injects this header for Cron Jobs.
  // We compare it against an environment variable to prevent external abuse.
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Allow running in development without secret for testing
    if (process.env.NODE_ENV !== 'development') {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  try {
    // 2. FETCH TARGET ANIME
    const airingAnimeList = await getAiringAnimeFromDB_MOCK();
    const updates: string[] = [];

    console.log(`[CRON] Starting update check for ${airingAnimeList.length} series...`);

    // 3. CHECK PROVIDER FOR EACH
    for (const anime of airingAnimeList) {
      const result = await syncService.syncEpisodes(anime.title);

      if (result.success && result.episodes.length > 0) {
        const remoteCount = result.episodes.length;
        const localCount = anime.episodes;

        if (remoteCount > localCount) {
          const newEpisodesCount = remoteCount - localCount;
          
          // 4. UPDATE DETECTED
          // In a real app: 
          // await db.anime.update({ 
          //   where: { id: anime.id }, 
          //   data: { episodes: remoteCount, lastUpdated: new Date() } 
          // });
          
          updates.push(`${anime.title}: +${newEpisodesCount} new eps (Total: ${remoteCount})`);
          console.log(`[UPDATE] ${anime.title} updated to ${remoteCount} episodes.`);
        } else {
            // No changes
            // console.log(`[NO CHANGE] ${anime.title} is up to date.`);
        }
      }
    }

    // 5. RETURN SUMMARY
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