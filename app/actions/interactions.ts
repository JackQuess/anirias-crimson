// Mock DB for Demo
const MOCK_WATCHLIST = new Set<string>(); // "userId-animeId"
const MOCK_FAVORITES = new Set<string>();

export async function getInteractionStatus(animeId: string) {
  try {
    const userId = "me"; // Mock user
    const isInWatchlist = MOCK_WATCHLIST.has(`${userId}-${animeId}`);
    const isFavorite = MOCK_FAVORITES.has(`${userId}-${animeId}`);
    return { isInWatchlist, isFavorite };
  } catch (error) {
    console.error("Failed to fetch status:", error);
    return { isInWatchlist: false, isFavorite: false };
  }
}

export async function toggleWatchlistAction(animeId: string, currentState: boolean) {
  try {
    const userId = "me";
    const key = `${userId}-${animeId}`;
    if (currentState) {
        MOCK_WATCHLIST.delete(key);
    } else {
        MOCK_WATCHLIST.add(key);
    }
    return { success: true, newState: !currentState };
  } catch (error) {
    console.error("Watchlist toggle failed:", error);
    return { success: false, newState: currentState }; // Revert on fail
  }
}

export async function toggleFavoriteAction(animeId: string, currentState: boolean) {
  try {
    const userId = "me";
    const key = `${userId}-${animeId}`;
    if (currentState) {
        MOCK_FAVORITES.delete(key);
    } else {
        MOCK_FAVORITES.add(key);
    }
    return { success: true, newState: !currentState };
  } catch (error) {
    console.error("Favorite toggle failed:", error);
    return { success: false, newState: currentState };
  }
}
