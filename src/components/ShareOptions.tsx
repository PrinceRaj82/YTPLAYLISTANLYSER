
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Share, Copy, Code } from "lucide-react";
import { toast } from "sonner";

interface ShareOptionsProps {
  playlistId: string;
}

const ShareOptions = ({ playlistId }: ShareOptionsProps) => {
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  
  // Ensure we're using absolute URLs that will work when shared
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/playlist/${playlistId}`;
  
  const embedCode = `<iframe 
  width="100%" 
  height="450" 
  src="${baseUrl}/embed/${playlistId}" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen></iframe>`;

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error("Failed to copy. Please try again."));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'YouTube Playlist Analysis',
          text: 'Check out this YouTube playlist analysis!',
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        copyToClipboard(shareUrl, "Link copied to clipboard");
      }
    } else {
      copyToClipboard(shareUrl, "Link copied to clipboard");
    }
  };

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Share className="h-4 w-4" />
          Share This Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Share the link to this analysis:</p>
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="bg-background/50" />
            <Button 
              onClick={() => copyToClipboard(shareUrl, "Link copied to clipboard")}
              className="flex-shrink-0"
              variant="outline"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2" 
            onClick={() => setShowEmbedCode(!showEmbedCode)}
          >
            <Code className="h-4 w-4" />
            {showEmbedCode ? "Hide Embed Code" : "Show Embed Code"}
          </Button>
        </div>

        {showEmbedCode && (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground mb-2">
              Copy this code to embed the analysis on your website:
            </p>
            <div className="relative">
              <textarea 
                value={embedCode} 
                readOnly 
                rows={4}
                className="w-full p-3 rounded-md border bg-background/50 text-xs font-mono"
              />
              <Button 
                size="sm"
                variant="outline"
                className="absolute right-2 top-2"
                onClick={() => copyToClipboard(embedCode, "Embed code copied to clipboard")}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        <Button onClick={handleShare} className="w-full btn-gradient text-white">
          <Share className="h-4 w-4 mr-2" />
          Share Analysis
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShareOptions;
