
import { Anime, Episode, AnimeSourceData, Character } from '../types';

// Using a public Consumet API instance. 
// Note: Public instances can be rate-limited. In production, host your own.
const BASE_URL = 'https://api.consumet.org/anime/hianime';

// --- MOCK DATA GENERATORS (Fallback) ---
// We keep these to ensure the site never looks broken if the API is down.
const generateMockCharacters = (): Character[] => [
  { id: 'c1', name: 'Rias Gremory', role: 'Main', imageUrl: 'https://picsum.photos/seed/rias/200/200', voiceActor: 'Yōko Hikasa' },
  { id: 'c2', name: 'Issei Hyoudou', role: 'Main', imageUrl: 'https://picsum.photos/seed/issei/200/200', voiceActor: 'Yuki Kaji' },
  { id: 'c3', name: 'Akeno Himejima', role: 'Supporting', imageUrl: 'https://picsum.photos/seed/akeno/200/200', voiceActor: 'Shizuka Itō' },
];

const getMockAnime = (id: string): Anime => ({
  id: id,
  title: "CRIMSON EXTINCTION (API DOWN)",
  description: "The API is currently unavailable. This is fallback data to demonstrate the UI. In a world where magic determines social standing, one boy devoid of mana discovers an ancient anti-magic grimoire.",
  imageUrl: `https://picsum.photos/seed/${id}/600/900`,
  tags: ["Action", "Fallback", "Demo"],
  rating: 9.8,
  episodes: 12,
  type: 'TV',
  status: 'Airing',
  sub: 24,
  dub: 12,
  duration: "24m",
  year: 2024,
  studio: "TNK",
  characters: generateMockCharacters()
});

// --- API SERVICE ---

class AnimeService {
  
  /**
   * Generic fetch wrapper with timeout
   */
  private async fetchJson<T>(endpoint: string): Promise<T> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 8000); // 8s timeout

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        signal: controller.signal
      });
      
      clearTimeout(id);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(id);
      console.error(`Fetch failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Maps raw API data to our Anime Interface
   */
  private mapToAnime(data: any): Anime {
    return {
      id: data.id,
      title: data.title?.english || data.title?.romaji || data.title?.native || "Unknown Title",
      description: data.description || "No description available.",
      imageUrl: data.image || "",
      coverUrl: data.cover,
      tags: data.genres || [],
      rating: data.rating ? data.rating / 10 : 0, // API often uses 1-100, we might use 1-10
      episodes: data.totalEpisodes || 0,
      type: data.type || 'TV',
      status: data.status || 'Finished',
      sub: data.episodes?.length || 0, // Approximation
      dub: 0, // API doesn't always separate sub/dub counts clearly in list view
      duration: data.duration || "24m",
      year: data.releaseDate,
      studio: data.studios?.[0],
      season: data.season
    };
  }

  /**
   * 1. Get Trending Animes
   */
  async getTrendingAnimes(): Promise<Anime[]> {
    try {
      const data: any = await this.fetchJson('/trending');
      return data.results.map(this.mapToAnime);
    } catch (e) {
      console.warn("Falling back to mock trending data");
      return Array.from({ length: 5 }).map((_, i) => getMockAnime(`trending-${i}`));
    }
  }

  /**
   * 2. Search Anime
   */
  async searchAnime(query: string, page: number = 1): Promise<Anime[]> {
    try {
      const data: any = await this.fetchJson(`/${encodeURIComponent(query)}?page=${page}`);
      return data.results.map(this.mapToAnime);
    } catch (e) {
      return []; // Return empty on search fail
    }
  }

  /**
   * 3. Get Anime Details (Info Page)
   */
  async getAnimeDetails(id: string): Promise<Anime | null> {
    try {
      const data: any = await this.fetchJson(`/info/${id}`);
      
      // Detailed mapping
      const anime = this.mapToAnime(data);
      anime.characters = data.characters?.map((c: any) => ({
        id: c.id || c.name,
        name: c.name.full || c.name,
        role: c.role || 'Supporting',
        imageUrl: c.image,
        voiceActor: c.voiceActors?.[0]?.name?.full
      })) || [];
      
      // Recalculate episodes based on detailed list if available
      if(data.episodes) {
        anime.episodes = data.episodes.length;
      }

      return anime;
    } catch (e) {
      console.warn("Falling back to mock detail data");
      return getMockAnime(id);
    }
  }

  /**
   * 4. Get Episodes List
   */
  async getEpisodes(animeId: string): Promise<Episode[]> {
     try {
       const data: any = await this.fetchJson(`/info/${animeId}`);
       return data.episodes.map((ep: any) => ({
         id: ep.id,
         number: ep.number,
         title: ep.title || `Episode ${ep.number}`,
         isFiller: ep.isFiller
       }));
     } catch (e) {
       // Return mock episodes
       return Array.from({length: 12}).map((_, i) => ({
         id: `ep-mock-${i}`, number: i+1, title: `Episode ${i+1}`
       }));
     }
  }

  /**
   * 5. Get Episode Streaming Sources
   */
  async getEpisodeSources(episodeId: string): Promise<AnimeSourceData | null> {
    try {
      // Note: Consumet often splits streaming to a different endpoint format
      // For hianime, usually: /watch/{episodeId}?server={serverName}
      const data: any = await this.fetchJson(`/watch/${episodeId}`);
      
      return {
        sources: data.sources.map((s: any) => ({
          url: s.url,
          quality: s.quality || 'default',
          isM3U8: s.isM3U8
        })),
        download: data.download
      };
    } catch (e) {
      console.error("Error fetching sources", e);
      return null; 
    }
  }
}

export const animeApi = new AnimeService();
