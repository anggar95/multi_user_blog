'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface PostStatsProps {
  postId: string;
  days?: number; 
}

interface StatsData {
  date: string;
  views: number;
  likes: number;
  comments: number;
}

export function PostStats({ postId }: PostStatsProps) {
  const [stats, setStats] = useState<StatsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}/stats`);
        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [postId]);

  if (isLoading) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={stats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#8884d8"
            name="Views"
          />
          <Line
            type="monotone"
            dataKey="likes"
            stroke="#82ca9d"
            name="Likes"
          />
          <Line
            type="monotone"
            dataKey="comments"
            stroke="#ffc658"
            name="Comments"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 