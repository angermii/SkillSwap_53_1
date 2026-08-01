import { ReactNode } from 'react'

export interface NotificationItemProps {
  title?: string;
  description?: string;
  date?: string;
  button?: ReactNode;
  status: 'read' | 'unread'
}
