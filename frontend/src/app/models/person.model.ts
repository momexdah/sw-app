import { Starship } from './starship.model';

export interface Person {
  id: number;
  name: string;
  height: string;
  mass: string;
  swapiId: string;
  starships: Starship[];
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}