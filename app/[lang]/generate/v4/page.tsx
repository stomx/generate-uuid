import { UuidGenerator } from '@/components/generator';
import { locales, generatePageMetadata, type Locale } from '@/lib/i18n';

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return generatePageMetadata(lang, 'v4', '/generate/v4');
}

export default function GenerateV4Page() {
  return <UuidGenerator initialVersion="v4" />;
}
