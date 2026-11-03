
export interface CollectionBook {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  createdAt: string;

  totalCopies: number;
  availableCopies: number;

  userEmail: string;
  userName?: string;
  userId?: string;

  imageName?: string;
  imageMimeType?: string;
  imageUrl?: string;

  updatedAt?: string;
}

export interface CollectionBooksResponse {
  success: boolean;
  count: number;
  books: CollectionBook[];
  message?: string;
}
