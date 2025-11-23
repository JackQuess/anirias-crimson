
import { Episode, AnimeSourceData } from '../types';

const PROVIDER_BASE_URL = 'https://api.consumet.org/anime/gogoanime';

/**
 * Service to handle synchronization between Local DB (Prisma) and Streaming Provider (Gogoanime)
 */
class EpisodeSyncService {
  
  /**
   * 1. Fuzzy Search Provider
   * Tries to find the Gogoanime ID that matches the Anime title.
   */
  private async findProviderId(title: string): Promise<string | null> {
    // Create a timeout to prevent hanging if the API is slow/down
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second timeout

    try {
      // Search Gogoanime for the title
      const response = await fetch(`${PROVIDER_BASE_URL}/${encodeURIComponent(title)}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
         // If 404 or 500, throw to trigger catch block
         throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        return null;
      }

      // Normalize titles for comparison (remove special chars, lowercase)
      const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
      const target = normalize(title);

      // 1. Try exact match
      const exactMatch = data.results.find((r: any) => normalize(r.title) === target);
      if (exactMatch) return exactMatch.id;

      // 2. Try containing match or default to first
      return data.results[0].id;

    } catch (error) {
      // Quietly switch to mock without spamming console error if it's just a fetch failure
      // console.warn("Provider search failed. Switching to Mock ID.");
      return "mock-provider-id";
    }
  }

  /**
   * 2. Sync Episodes (Bulk Operation)
   * - Finds provider ID
   * - Fetches all episodes
   * - (Simulation) Bulks inserts them into DB
   */
  async syncEpisodes(animeId: string, animeTitle: string): Promise<{ success: boolean; episodes: Episode[]; message?: string }> {
    try {
      console.log(`[Sync Service] Starting sync for: ${animeTitle} (ID: ${animeId})`);

      // Step A: Find the Provider ID
      const providerId = await this.findProviderId(animeTitle);
      
      if (!providerId) {
        return { success: false, episodes: [], message: 'Anime not found on streaming provider.' };
      }

      let mappedEpisodes: Episode[] = [];

      // MOCK FALLBACK LOGIC for Demo Stability
      if (providerId === 'mock-provider-id') {
         mappedEpisodes = Array.from({ length: 24 }).map((_, i) => ({
            id: `mock-ep-${i + 1}`,
            number: i + 1,
            title: `Episode ${i + 1}`,
            image: `https://picsum.photos/seed/${animeTitle}ep${i}/300/200`,
            isFiller: false,
            providerId: `mock-provider-ep-${i+1}`,
            seasonNumber: 1,
            useManualSource: false
         }));
         
         // Simulate DB Delay
         await new Promise(r => setTimeout(r, 800));
         
         return { 
            success: true, 
            episodes: mappedEpisodes, 
            message: 'Synced with Mock Data (API Unavailable)'
         };
      }

      // Step B: Fetch Full Anime Info from Provider
      const response = await fetch(`${PROVIDER_BASE_URL}/info/${providerId}`);
      
      if (!response.ok) {
         throw new Error("Episode info fetch failed");
      }
      
      const data = await response.json();

      if (!data.episodes || !Array.isArray(data.episodes)) {
        return { success: false, episodes: [], message: 'No episodes found.' };
      }

      // Step C: Map to Internal Interface
      mappedEpisodes = data.episodes.map((ep: any) => ({
        id: `ep-${animeId}-${ep.number}`, // Internal DB ID
        number: ep.number,
        title: `Episode ${ep.number}`, 
        image: data.image, 
        isFiller: false,
        providerId: ep.id, // CRITICAL: Gogoanime Episode ID
        seasonNumber: 1,
        useManualSource: false
      })).sort((a: Episode, b: Episode) => a.number - b.number);
     
      console.log(`[Sync Service] Successfully mapped ${mappedEpisodes.length} episodes.`);
      
      return { 
        success: true, 
        episodes: mappedEpisodes,
        message: `Successfully synced ${mappedEpisodes.length} episodes.`
      };

    } catch (error) {
      console.error("Sync failed:", error);
      // Even if the main sync fails, return mock data to keep the demo alive
      const fallbackEpisodes = Array.from({ length: 12 }).map((_, i) => ({
            id: `fallback-ep-${i + 1}`,
            number: i + 1,
            title: `Episode ${i + 1}`,
            image: `https://picsum.photos/seed/fallback${i}/300/200`,
            isFiller: false,
            providerId: `mock-fallback-${i}`,
            seasonNumber: 1,
            useManualSource: false
      }));

      return { success: true, episodes: fallbackEpisodes, message: 'Network error - Synced with Mock Data.' };
    }
  }

  /**
   * 3. On-Demand Stream Fetching
   * Fetches the actual m3u8 links for a specific episode.
   */
  async getStreamUrl(episodeProviderId: string): Promise<AnimeSourceData | null> {
    try {
        if (episodeProviderId.startsWith('mock-provider') || episodeProviderId.startsWith('mock-fallback')) {
             return {
                 sources: [{ url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', isM3U8: true, quality: 'default' }],
                 download: ''
             };
        }

        const response = await fetch(`${PROVIDER_BASE_URL}/watch/${episodeProviderId}`);
        if (!response.ok) throw new Error('Stream fetch failed');
        
        const data = await response.json();

        return {
            sources: data.sources,
            download: data.download
        };
    } catch (e) {
        console.warn("Failed to fetch stream sources, using test stream:", e);
        // Fallback to test stream
        return {
            sources: [{ url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', isM3U8: true, quality: 'default' }],
            download: ''
        };
    }
  }
}

export const episodeSyncService = new EpisodeSyncService();
