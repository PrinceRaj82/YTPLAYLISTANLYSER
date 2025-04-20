
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaylistById, fetchPlaylistData, savePlaylistToHistory } from "@/utils/youtubeApi";
import type { PlaylistData } from "@/utils/youtubeApi";
import PlaylistStatsCard from "@/components/PlaylistStatsCard";
import DurationChart from "@/components/DurationChart";
import LoadingAnimation from "@/components/LoadingAnimation";

const EmbedPage = () => {
  const { id } = useParams<{id: string}>();
  const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlaylist = async () => {
      if (!id) return;
      
      setLoading(true);
      
      // First try to get from local storage
      const cachedPlaylist = getPlaylistById(id);
      
      if (cachedPlaylist) {
        setPlaylist(cachedPlaylist);
        setLoading(false);
        return;
      }
      
      // If not in cache, fetch from API
      try {
        const data = await fetchPlaylistData(id);
        
        if (data) {
          setPlaylist(data);
          savePlaylistToHistory(data);
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylist();
  }, [id]);

  if (loading) {
    return <LoadingAnimation text="Loading playlist data..." />;
  }

  if (!playlist) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-lg font-bold mb-2">Playlist Not Found</h1>
        <p className="text-sm text-muted-foreground">
          The playlist could not be loaded or doesn't exist.
        </p>
      </div>
    );
  }

  // Get the current origin for creating absolute URLs
  const origin = window.location.origin;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
          <img 
            src={playlist.thumbnail || '/placeholder.svg'} 
            alt={playlist.title}
            className="w-full h-full object-cover" 
          />
        </div>
        <div>
          <h1 className="text-lg font-bold line-clamp-1">{playlist.title}</h1>
          <p className="text-xs text-muted-foreground">
            {playlist.channelTitle} • {playlist.videoCount} videos
          </p>
        </div>
      </div>
      
      <PlaylistStatsCard playlist={playlist} />
      
      <DurationChart videos={playlist.videos} />
      
      <div className="text-center text-xs text-muted-foreground pt-2">
        <a 
          href={`${origin}/playlist/${playlist.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          View full analysis
        </a>
      </div>
    </div>
  );
};

export default EmbedPage;
