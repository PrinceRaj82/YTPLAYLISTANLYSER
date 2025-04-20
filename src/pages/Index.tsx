
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PlaylistUrlInput from "@/components/PlaylistUrlInput";
import PlaylistHistory from "@/components/PlaylistHistory";
import ThemeToggle from "@/components/ThemeToggle";
import { fetchPlaylistData, savePlaylistToHistory } from "@/utils/youtubeApi";
import LoadingAnimation from "@/components/LoadingAnimation";
import { toast } from "sonner";
import { Clock } from "lucide-react";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyzePlaylist = async (playlistId: string) => {
    setIsLoading(true);
    
    try {
      const playlistData = await fetchPlaylistData(playlistId);
      
      if (playlistData) {
        // Save to history
        savePlaylistToHistory(playlistData);
        
        // Navigate to the playlist details page
        navigate(`/playlist/${playlistId}`);
      } else {
        toast.error("Failed to load playlist data. Please check the URL and try again.");
      }
    } catch (error) {
      console.error("Error analyzing playlist:", error);
      toast.error("An error occurred while analyzing the playlist.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-playlist-primary" />
            <h1 className="text-xl font-bold">YouTube Playlist Length Finder</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-grow container py-8 md:py-16 space-y-8">
        <Card className="card-gradient max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Analyze Any YouTube Playlist</CardTitle>
            <CardDescription>
              Enter a YouTube playlist URL to get detailed information about its duration, 
              videos, and more.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PlaylistUrlInput onAnalyze={handleAnalyzePlaylist} isLoading={isLoading} />
            
            {isLoading && (
              <div className="mt-8">
                <LoadingAnimation text="Analyzing your playlist..." />
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="max-w-3xl mx-auto">
          <PlaylistHistory />
        </div>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="text-lg">About YouTube Playlist Length Finder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                YouTube Playlist Length Finder helps you quickly analyze any YouTube playlist 
                to get detailed insights about its duration, video counts, and more.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Why use this tool?</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Find out how long a course playlist will take to complete</li>
                    <li>Plan your viewing time for movie or TV show playlists</li>
                    <li>Analyze your own playlist statistics</li>
                    <li>Share playlist analytics with others</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Features</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Total duration in human-readable format</li>
                    <li>Video count and average length</li>
                    <li>Duration breakdown by video length</li>
                    <li>List of longest videos</li>
                    <li>Shareable results</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>YouTube Playlist Length Finder &copy; {new Date().getFullYear()}</p>
          <p className="text-xs mt-1">
            This site is not affiliated with YouTube or Google.
          </p>
          <p className="text-xs mt-1">
            Creator <a href='https://rajkumar-prince.netlify.app'><span>Rajkumar prince</span></a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
