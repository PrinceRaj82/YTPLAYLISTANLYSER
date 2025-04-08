
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactDuration } from "@/utils/youtubeApi";
import type { Video } from "@/utils/youtubeApi";
import { Clock } from "lucide-react";

interface LongestVideosProps {
  videos: Video[];
  limit?: number;
}

const LongestVideos = ({ videos, limit = 5 }: LongestVideosProps) => {
  // Sort videos by duration (longest first) and take the top 'limit'
  const longestVideos = [...videos]
    .sort((a, b) => b.duration - a.duration)
    .slice(0, limit);

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="text-lg">Longest Videos</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {longestVideos.map((video) => (
            <li key={video.id} className="flex gap-3">
              <div className="flex-shrink-0 relative w-24 h-14 overflow-hidden rounded-md">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-0 right-0 bg-black/80 text-white text-xs px-1 py-0.5 flex items-center">
                  <Clock className="h-3 w-3 mr-0.5" />
                  {formatCompactDuration(video.duration)}
                </div>
              </div>
              <div className="flex-grow min-w-0">
                <a 
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium line-clamp-2 hover:text-playlist-primary transition-colors"
                >
                  {video.title}
                </a>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatCompactDuration(video.duration)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default LongestVideos;
