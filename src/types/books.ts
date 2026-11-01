export interface CollectionBook {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  createdAt: string;

  // Collection specific properties
  totalCopies: number;
  availableCopies: number;
  userEmail: string;
  userName?: string;

  imageName?: string;
  imageMimeType?: string;
}