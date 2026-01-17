import { UuidGenerator } from '@/components/generator';
import { generatePageMetadata } from '@/lib/i18n';

export async function generateMetadata() {
  return generatePageMetadata('ko', 'v7', '/generate/v7');
}

export default function GenerateV7Page() {
  return <UuidGenerator initialVersion="v7" />;
}
