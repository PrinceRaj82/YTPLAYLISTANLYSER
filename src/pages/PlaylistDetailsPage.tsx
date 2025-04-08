
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { fetchPlaylistData, getPlaylistById, savePlaylistToHistory } from "@/utils/youtubeApi";
import type { PlaylistData } from "@/utils/youtubeApi";
import PlaylistStatsCard from "@/components/PlaylistStatsCard";
import DurationChart from "@/components/DurationChart";
import LongestVideos from "@/components/LongestVideos";
import ShareOptions from "@/components/ShareOptions";
import LoadingAnimation from "@/components/LoadingAnimation";

const PlaylistDetailsPage = () => {
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
        } else {
          toast.error("Failed to load playlist data");
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
        toast.error("Error loading playlist data");
      } finally {
        setLoading(false);
      }
    };

    loadPlaylist();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-16">
        <LoadingAnimation text="Analyzing playlist..." />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Playlist Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The playlist you're looking for doesn't exist or couldn't be loaded.
        </p>
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button 
          variant="ghost" 
          asChild
          className="h-8 px-2 mb-2"
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <div className="aspect-video rounded-lg overflow-hidden shadow-md mb-4">
            <img 
              src={playlist.thumbnail || '/placeholder.svg'} 
              alt={playlist.title}
              className="w-full h-full object-cover" 
            />
          </div>
          <h1 className="text-xl font-bold mb-1 line-clamp-2">{playlist.title}</h1>
          <p className="text-sm text-muted-foreground mb-2">
            By {playlist.channelTitle}
          </p>
          <a 
            href={`https://www.youtube.com/playlist?list=${playlist.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-playlist-primary hover:underline text-sm inline-block mb-6"
          >
            View on YouTube
          </a>
          
          <ShareOptions playlistId={playlist.id} />
        </div>
        
        <div className="w-full md:w-2/3 lg:w-3/4 space-y-6">
          <PlaylistStatsCard playlist={playlist} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DurationChart videos={playlist.videos} />
            <LongestVideos videos={playlist.videos} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetailsPage;
