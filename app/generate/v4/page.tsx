import { UuidGenerator } from '@/components/generator';
import { generatePageMetadata } from '@/lib/i18n';

export async function generateMetadata() {
  return generatePageMetadata('en', 'v4', '/generate/v4');
}

export default function GenerateV4Page() {
  return <UuidGenerator initialVersion="v4" />;
}
