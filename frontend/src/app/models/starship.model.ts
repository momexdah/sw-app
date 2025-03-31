export interface Starship {
  id: number;
  name: string;
  model: string;
  swapiId: string;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}