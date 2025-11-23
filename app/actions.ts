
import { Anime, NotificationType } from '../types';
import { episodeSyncService } from '../services/episode-sync';

// In a real Next.js app, you would add 'use server' at the top.
// 'use server';

// import { revalidatePath } from 'next/cache';

/**
 * Server Action to import anime data into the database.
 */
export async function importAnimeFromAniList(anime: Anime) {
  try {
    // 1. DATABASE OPERATION (Simulated)
    // await db.anime.create({ data: anime });
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log(`[Server Action] Successfully saved: ${anime.title}`);

    // 2. REVALIDATE CACHE
    // revalidatePath('/admin/anime');

    return { success: true, message: `Successfully imported "${anime.title}" to the Grimoire.` };
  } catch (error) {
    console.error("Import failed:", error);
    return { success: false, message: "Failed to import anime. Please check the server logs." };
  }
}

/**
 * Server Action to Sync Episodes for a given Anime
 */
export async function syncEpisodesAction(animeId: string, animeTitle: string) {
    try {
        console.log(`[Server Action] Syncing episodes for ${animeTitle}...`);
        
        // Delegate to service
        const result = await episodeSyncService.syncEpisodes(animeId, animeTitle);
        
        if (result.success) {
             // revalidatePath(`/admin/anime`);
             return { success: true, episodes: result.episodes, message: result.message };
        } else {
             return { success: false, message: result.message };
        }

    } catch (error) {
        console.error("Sync Action failed:", error);
        return { success: false, message: "Internal Server Error during sync." };
    }
}

/**
 * Server Action to Get Stream URL (On-Demand)
 */
export async function getStreamUrlAction(episodeProviderId: string) {
    // This protects the provider API key/logic from being exposed directly to client if we were using a private API
    const data = await episodeSyncService.getStreamUrl(episodeProviderId);
    return data;
}

/**
 * Server Action to Mark Notifications as Read
 */
export async function markNotificationsRead(notificationIds: string[]) {
  try {
    // await db.notification.updateMany({
    //   where: { id: { in: notificationIds } },
    //   data: { isRead: true }
    // });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * Server Action to Send a Notification (System/Admin use)
 */
export async function sendNotification(userId: string, title: string, message: string, type: NotificationType) {
  try {
    // await db.notification.create({
    //   data: { userId, title, message, type }
    // });
    console.log(`[Notification Sent] To ${userId}: ${title}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to send notification:", error);
    return { success: false };
  }
}
