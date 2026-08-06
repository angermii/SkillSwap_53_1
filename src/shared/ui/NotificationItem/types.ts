export type Notification = {
  id: string
  title?: string;
  description?: string;
  date?: string;
  status?: 'read' | 'unread';
  onClick?: () => void;
}
