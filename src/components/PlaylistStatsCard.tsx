
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Film, Eye, PlayCircle } from "lucide-react";
import { formatDuration } from "@/utils/youtubeApi";
import type { PlaylistData } from "@/utils/youtubeApi";

interface PlaylistStatsCardProps {
  playlist: PlaylistData;
}

const PlaylistStatsCard = ({ playlist }: PlaylistStatsCardProps) => {
  // Calculate estimated watch time (25% of total)
  const estimatedViewTime = Math.round(playlist.totalDuration * 0.25);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card className="card-gradient">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-playlist-primary" />
            Total Duration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatDuration(playlist.totalDuration)}</p>
        </CardContent>
      </Card>
      
      <Card className="card-gradient">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Film className="h-4 w-4 text-playlist-primary" />
            Video Count
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{playlist.videoCount} video{playlist.videoCount !== 1 ? 's' : ''}</p>
        </CardContent>
      </Card>
      
      <Card className="card-gradient">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <PlayCircle className="h-4 w-4 text-playlist-primary" />
            Average Duration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatDuration(Math.round(playlist.averageDuration))}</p>
        </CardContent>
      </Card>
      
      {playlist.totalViews ? (
        <Card className="card-gradient">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-playlist-primary" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{playlist.totalViews.toLocaleString()}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="card-gradient">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-playlist-primary" />
              Estimated Watch Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatDuration(estimatedViewTime)}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlaylistStatsCard;
