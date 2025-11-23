import { ImageResponse } from 'next/og';
import { animeApi } from '../../../services/animeApi';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Anirias Anime Preview';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image({ params }: { params: { id: string } }) {
  const anime = await animeApi.getAnimeDetails(params.id);

  // Fallback values if API fails
  const title = anime?.title || 'Anirias Stream';
  const image = anime?.imageUrl || 'https://picsum.photos/1200/630';
  const rating = anime?.rating || 9.9;
  const tags = anime?.tags.slice(0, 3).join(' • ') || 'Anime • Action';

  return new ImageResponse(
    (
      // ImageResponse JSX (Subset of React/CSS)
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          backgroundColor: '#050505',
          position: 'relative',
          fontFamily: 'serif',
        }}
      >
        {/* Background Image */}
        <img
          src={image}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.6,
          }}
        />

        {/* Dark Grimoire Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to right, #0a0a0a 10%, rgba(10,10,10,0.8) 50%, transparent 100%)',
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '60px',
            zIndex: 10,
            maxWidth: '700px',
          }}
        >
          {/* Brand Badge */}
          <div
            style={{
              backgroundColor: '#990011',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '4px',
              fontSize: 24,
              fontWeight: 900,
              marginBottom: '20px',
              boxShadow: '0 0 20px rgba(153,0,17,0.6)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Anirias
          </div>

          {/* Anime Title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: 'white',
              lineHeight: 1,
              marginBottom: '20px',
              textShadow: '0 4px 10px rgba(0,0,0,0.8)',
              textTransform: 'uppercase',
            }}
          >
            {title.length > 40 ? title.slice(0, 40) + '...' : title}
          </div>

          {/* Metadata Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              fontSize: 28,
              color: '#e5e5e5',
              marginBottom: '40px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#FFD700', marginRight: '8px' }}>★</span>
              {rating}
            </div>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#666' }} />
            <div>HD</div>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#666' }} />
            <div>{tags}</div>
          </div>

          {/* CTA Button Simulation */}
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '2px solid #990011',
              borderRadius: '12px',
              padding: '16px 40px',
              color: 'white',
              fontSize: 32,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: 0, 
                height: 0, 
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
                borderLeft: '16px solid white',
                marginRight: '10px'
              }}
            />
            Watch Now
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}