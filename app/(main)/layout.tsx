import type { ReactNode } from 'react';
import { LangLayoutClient, StructuredData } from '@/components/common';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StructuredData locale="en" />
      <LangLayoutClient lang="en">{children}</LangLayoutClient>
    </>
  );
}
