import { UuidGenerator } from '@/components/generator';
import { locales, generatePageMetadata, type Locale } from '@/lib/i18n';

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return generatePageMetadata(lang, 'v7', '/generate/v7');
}

export default function GenerateV7Page() {
  return <UuidGenerator initialVersion="v7" />;
}
