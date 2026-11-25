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

export interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  image?: string;
  borrowedDate?: string;
  borrowDate?: string;
  createdAt?: string;
  returnDate: string;
};

export interface TrendingBook {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
}

export interface borrowedBook {
  bookId: string;
  title: string;
  initialAvailable: number;
  totalCopies: number;
  addedBy: string;
  addedOn: string;
  userName: string;
  userEmail: string;
}