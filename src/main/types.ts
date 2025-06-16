export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  calories: number;
  video_file: string;
  preview_image: string;
  video_url: string;
  preview_image_url: string;
  order?: number;
  category?: {
    id: number;
    name: string;
    slug: string;
    description: string;
    lessons_count: number;
  };
  tags?: any[];
} 