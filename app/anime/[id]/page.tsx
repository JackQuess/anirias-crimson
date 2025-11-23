import { Metadata } from 'next';
import { animeApi } from '../../../services/animeApi'; // Assume valid import path
import AnimeDetail from '../../../components/AnimeDetail'; // Client Component

interface Props {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// 1. Dynamic Metadata Generation
export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  // Fetch data using our service (server-side)
  const anime = await animeApi.getAnimeDetails(params.id);

  if (!anime) {
    return {
      title: 'Anime Not Found',
    };
  }

  return {
    title: anime.title, // Becomes "Title | Watch Free on Anirias" due to template
    description: `Watch ${anime.title} in HD for free on Anirias. ${anime.description.slice(0, 150)}...`,
    keywords: [anime.title, ...anime.tags, 'Free Streaming', 'Anirias'],
    openGraph: {
      title: `Watch ${anime.title} Free - Anirias`,
      description: anime.description,
      images: [
        {
          url: `/anime/${params.id}/opengraph-image`, // Points to our dynamic image generator
          width: 1200,
          height: 630,
          alt: `${anime.title} Poster`,
        },
      ],
    },
  };
}

// 2. Server Component Page
export default async function Page({ params }: Props) {
  const anime = await animeApi.getAnimeDetails(params.id);

  if (!anime) {
    return <div className="pt-32 text-center">Anime not found.</div>;
  }

  // Pass data to the Client Component
  // Note: We create a dummy handler for onPlay/onBack since Next.js routing differs from our SPA mock
  return (
    <AnimeDetail 
      anime={anime} 
      onPlay={() => { /* Handled via Link/Router in real app */ }}
      onBack={() => { /* Handled via router.back() */ }}
    />
  );
}