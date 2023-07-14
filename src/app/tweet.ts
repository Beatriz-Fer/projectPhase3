export interface Tweet {
  profilePic: string;
  author: string;
  email: string;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked?: boolean; // Optional 
  comments?: string[];
  originalAuthor?: string; // Optional
  originalDate?: Date;
  retweets: number; 
  commentText?: string; // Optional
  isCommented?: boolean; // Optional
  commentCount: number;
}

export interface Comment {
    author: string;
    content: string;
    timestamp: Date;
}
