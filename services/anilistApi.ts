
import { Anime, Character } from '../types';

const ANILIST_ENDPOINT = 'https://graphql.anilist.co';

// GraphQL Queries
const SEARCH_QUERY = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
      id
      title {
        romaji
        english
        native
      }
      description
      coverImage {
        extraLarge
        large
      }
      bannerImage
      genres
      averageScore
      episodes
      format
      status
      seasonYear
      duration
      studios(isMain: true) {
        nodes {
          name
        }
      }
      characters(sort: ROLE, page: 1, perPage: 6) {
        nodes {
          id
          name {
            full
          }
          image {
            large
          }
        }
        edges {
          role
        }
      }
    }
  }
}
`;

const TRENDING_QUERY = `
query ($perPage: Int) {
  Page(page: 1, perPage: $perPage) {
    media(type: ANIME, sort: TRENDING_DESC) {
      id
      title {
        romaji
        english
      }
      description
      coverImage {
        extraLarge
      }
      bannerImage
      genres
      averageScore
      episodes
      format
      status
      seasonYear
      duration
    }
  }
}
`;

class AniListService {
  
  private async fetchGraphQL(query: string, variables: any) {
    try {
      const response = await fetch(ANILIST_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });
      
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.errors?.[0]?.message || 'AniList API Error');
      }
      return json.data;
    } catch (error) {
      console.error('AniList Fetch Error:', error);
      throw error;
    }
  }

  // Transform AniList Data -> Internal Anime Interface
  private transformAnime(data: any): Anime {
    // Clean description (AniList returns HTML)
    const cleanDesc = data.description 
      ? data.description.replace(/<br>/g, '\n').replace(/<[^>]+>/g, '') 
      : 'No description available.';

    const characters: Character[] = data.characters 
      ? data.characters.nodes.map((char: any, index: number) => ({
          id: char.id.toString(),
          name: char.name.full,
          imageUrl: char.image.large,
          role: data.characters.edges[index].role === 'MAIN' ? 'Main' : 'Supporting',
          voiceActor: 'Unknown' // AniList requires nested query for VAs, simplified here
        }))
      : [];

    return {
      id: data.id.toString(),
      title: data.title.english || data.title.romaji || data.title.native,
      description: cleanDesc,
      imageUrl: data.coverImage.extraLarge || data.coverImage.large,
      coverUrl: data.bannerImage || data.coverImage.extraLarge,
      tags: data.genres || [],
      rating: data.averageScore ? Number((data.averageScore / 10).toFixed(1)) : 0,
      episodes: data.episodes || 0,
      type: data.format === 'TV' ? 'TV' : data.format === 'MOVIE' ? 'MOVIE' : 'SPECIAL',
      status: data.status === 'RELEASING' ? 'Airing' : data.status === 'FINISHED' ? 'Finished' : 'Not yet aired',
      sub: data.episodes || 0,
      dub: 0, // Not provided by basic query
      duration: data.duration ? `${data.duration}m` : '24m',
      year: data.seasonYear,
      studio: data.studios?.nodes?.[0]?.name || 'Unknown Studio',
      characters: characters
    };
  }

  async search(query: string): Promise<Anime[]> {
    const data = await this.fetchGraphQL(SEARCH_QUERY, { search: query, page: 1, perPage: 12 });
    return data.Page.media.map(this.transformAnime);
  }

  async getTrending(count: number = 12): Promise<Anime[]> {
    const data = await this.fetchGraphQL(TRENDING_QUERY, { perPage: count });
    return data.Page.media.map(this.transformAnime);
  }
}

export const anilistApi = new AniListService();
