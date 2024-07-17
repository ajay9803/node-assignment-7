// todo interface
export interface Todo {
  id: string;
  title: string;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
}
