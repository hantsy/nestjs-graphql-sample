import { User } from './user.model';
export interface Comment {
  id?: string;
  content: string;
  author?: User;
  createdDate?: string;
}
