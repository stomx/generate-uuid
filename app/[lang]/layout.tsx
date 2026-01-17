import type { ReactNode } from 'react';
import { locales, isValidLocale, type Locale } from '@/lib/i18n';
import { LangLayoutClient, StructuredData } from '@/components/common';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // 유효하지 않은 언어는 404
  if (!isValidLocale(lang)) {
    notFound();
  }

  const locale = lang as Locale;

  return (
    <>
      <StructuredData locale={locale} />
      <LangLayoutClient lang={locale}>{children}</LangLayoutClient>
    </>
  );
}
