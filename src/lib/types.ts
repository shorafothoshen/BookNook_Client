export interface BookType {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
}

export interface BookDetails extends BookType {
  userName?: string;
  userEmail?: string;
  createdAt?: string;
  availableCopies?: number;
  totalCopies?: number;
};

export interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  updatedAt: string;
};

export interface RatingSummary {
  average: number;
  count: number;
  myRating: number;
  myComment: string;
  reviews: Review[];
};