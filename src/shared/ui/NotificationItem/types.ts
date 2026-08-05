import { ReactNode } from 'react'

export type Notification = {
  id: string
  title?: string;
  description?: string;
  date?: string;
  button?: ReactNode;
  status?: 'read' | 'unread'
}
