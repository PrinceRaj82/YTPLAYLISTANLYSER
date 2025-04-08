
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCompactDuration, formatDuration, getPlaylistHistory, clearPlaylistHistory } from "@/utils/youtubeApi";
import type { PlaylistData } from "@/utils/youtubeApi";
import { Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const PlaylistHistory = () => {
  const [history, setHistory] = useState<PlaylistData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = () => {
      const playlistHistory = getPlaylistHistory();
      setHistory(playlistHistory);
    };

    fetchHistory();
    
    // Add event listener for storage changes (for multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'playlist-history') {
        fetchHistory();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleClearHistory = () => {
    clearPlaylistHistory();
    setHistory([]);
    toast.success("Playlist history cleared");
  };

  const handleViewPlaylist = (playlistId: string) => {
    navigate(`/playlist/${playlistId}`);
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="card-gradient">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Recently Analyzed Playlists</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearHistory} 
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {history.map((playlist) => (
            <li 
              key={playlist.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors cursor-pointer"
              onClick={() => handleViewPlaylist(playlist.id)}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden">
                <img 
                  src={playlist.thumbnail || '/placeholder.svg'} 
                  alt={playlist.title}
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-medium text-sm line-clamp-1">{playlist.title}</h4>
                <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{formatCompactDuration(playlist.totalDuration)}</span>
                  <span className="mx-1.5">•</span>
                  <span>{playlist.videoCount} videos</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PlaylistHistory;
