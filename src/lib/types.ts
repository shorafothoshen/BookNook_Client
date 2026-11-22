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