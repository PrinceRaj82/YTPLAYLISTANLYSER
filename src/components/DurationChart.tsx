
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { groupVideosByDuration } from "@/utils/youtubeApi";
import type { Video } from "@/utils/youtubeApi";

interface DurationChartProps {
  videos: Video[];
}

const DurationChart = ({ videos }: DurationChartProps) => {
  const durationGroups = groupVideosByDuration(videos);
  
  // Convert to array for Recharts
  const data = Object.entries(durationGroups).map(([name, value]) => ({
    name,
    value
  }));

  // Define custom colors for the bars
  const COLORS = [
    '#818cf8', // Very Short
    '#6366f1', // Short
    '#4f46e5', // Medium
    '#4338ca', // Long
    '#3730a3'  // Very Long
  ];

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="text-lg">Video Duration Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 40,
              }}
            >
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={60} 
                tickMargin={5}
                className="text-xs" 
              />
              <YAxis allowDecimals={false} />
              <Tooltip 
                formatter={(value) => [`${value} videos`, 'Count']}
                labelStyle={{ color: '#333' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DurationChart;
