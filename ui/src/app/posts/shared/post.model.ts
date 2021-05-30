import { User } from './user.model';
export interface Post {
  id?: string;
  slug?: string;
  title: string;
  content: string;
  author?: User;
  createdAt?: any;
}
