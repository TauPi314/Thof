
export interface ChatMessage {
  id: string;
  project_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  created_at: string;
}

export interface ChangelogEntry {
  id: string;
  project_id: string;
  user_id: string;
  user_name: string;
  action: string;
  description: string;
  created_at: string;
}

export interface PendingClip {
  id: string;
  project_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  name: string;
  thumbnail: string;
  duration: number;
  src: string;
  votes: number;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  voting_batch?: string; // The batch/window this clip belongs to
  voting_rank?: number; // Ranking within its voting batch
  voting_ends_at?: string; // When the voting period ends
}
