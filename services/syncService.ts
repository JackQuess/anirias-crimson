
import { Episode } from '../types';

const PROVIDER_BASE_URL = 'https://api.consumet.org/anime/gogoanime';

class EpisodeSyncService {
  
  /**
   * 1. Fuzzy Search Provider
   * Tries to find the Gogoanime ID that matches the AniList title.
   */
  private async findProviderId(title: string): Promise<string | null> {
    try {
      // Search Gogoanime for the title
      const response = await fetch(`${PROVIDER_BASE_URL}/${encodeURIComponent(title)}`);
      
      if (!response.ok) {
         throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        return null;
      }

      // Simple matching logic:
      // 1. Try exact match first
      // 2. Return the first result otherwise (usually the most relevant)
      const exactMatch = data.results.find((r: any) => 
        r.title.toLowerCase() === title.toLowerCase()
      );

      return exactMatch ? exactMatch.id : data.results[0].id;
    } catch (error) {
      console.warn("Provider search failed (API likely down or rate-limited). Switching to Mock ID.");
      return "mock-provider-id";
    }
  }

  /**
   * 2. Sync Episodes
   * Orchestrates the flow: Find ID -> Fetch Info -> Map Episodes
   */
  async syncEpisodes(animeTitle: string): Promise<{ success: boolean; episodes: Episode[]; providerId?: string; message?: string }> {
    try {
      // Step A: Find the Provider ID
      const providerId = await this.findProviderId(animeTitle);
      
      if (!providerId) {
        return { success: false, episodes: [], message: 'Anime not found on streaming provider.' };
      }

      let mappedEpisodes: Episode[] = [];

      // MOCK FALLBACK LOGIC
      if (providerId === 'mock-provider-id') {
         mappedEpisodes = Array.from({ length: 12 }).map((_, i) => ({
            id: `mock-ep-${i + 1}`,
            number: i + 1,
            title: `Episode ${i + 1}`,
            image: `https://picsum.photos/seed/${animeTitle}ep${i}/300/200`,
            isFiller: false
         }));
         
         return { 
            success: true, 
            episodes: mappedEpisodes, 
            providerId: 'mock-provider-id',
            message: 'Synced with Mock Data (API Unavailable)'
         };
      }

      // Step B: Fetch Full Anime Info from Provider to get Episodes
      const response = await fetch(`${PROVIDER_BASE_URL}/info/${providerId}`);
      
      if (!response.ok) {
         throw new Error("Episode info fetch failed");
      }
      
      const data = await response.json();

      if (!data.episodes || !Array.isArray(data.episodes)) {
        return { success: false, episodes: [], message: 'No episodes found for this anime.' };
      }

      // Step C: Map to our Internal Interface
      mappedEpisodes = data.episodes.map((ep: any) => ({
        id: ep.id, 
        number: ep.number,
        title: `Episode ${ep.number}`, 
        image: data.image, 
        isFiller: false 
      })).sort((a: Episode, b: Episode) => a.number - b.number);

      return { 
        success: true, 
        episodes: mappedEpisodes, 
        providerId: providerId 
      };

    } catch (error) {
      console.error("Sync failed, falling back to mock data:", error);
      
      // Fallback generation even if the second fetch fails
      const fallbackEpisodes = Array.from({ length: 12 }).map((_, i) => ({
            id: `mock-ep-${i + 1}`,
            number: i + 1,
            title: `Episode ${i + 1}`,
            image: `https://picsum.photos/seed/${animeTitle}ep${i}/300/200`,
            isFiller: false
      }));

      return { 
          success: true, 
          episodes: fallbackEpisodes, 
          message: 'Network error - Synced with Mock Data.' 
      };
    }
  }
}

export const syncService = new EpisodeSyncService();
