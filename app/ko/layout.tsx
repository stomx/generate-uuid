import type { ReactNode } from 'react';
import { LangLayoutClient, StructuredData } from '@/components/common';

export default function KoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StructuredData locale="ko" />
      <LangLayoutClient lang="ko">{children}</LangLayoutClient>
    </>
  );
}
