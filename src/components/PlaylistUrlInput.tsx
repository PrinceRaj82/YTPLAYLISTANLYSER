
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractPlaylistId } from "@/utils/youtubeApi";
import { toast } from "sonner";

interface PlaylistUrlInputProps {
  onAnalyze: (playlistId: string) => void;
  isLoading?: boolean;
}

const PlaylistUrlInput = ({ onAnalyze, isLoading = false }: PlaylistUrlInputProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error("Please enter a YouTube playlist URL");
      return;
    }
    
    const playlistId = extractPlaylistId(url);
    
    if (!playlistId) {
      toast.error("Invalid YouTube playlist URL. Please check and try again.");
      return;
    }
    
    onAnalyze(playlistId);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
      <Input
        type="url"
        placeholder="https://www.youtube.com/playlist?list=..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-grow"
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        disabled={isLoading}
        className="btn-gradient text-white"
      >
        {isLoading ? "Analyzing..." : "Analyze Playlist"}
      </Button>
    </form>
  );
};

export default PlaylistUrlInput;
