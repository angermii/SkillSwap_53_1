import type { ReactNode, HTMLAttributes } from 'react';

export interface SkillInfoProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle: string;
  description: string;
  children?: ReactNode;
}