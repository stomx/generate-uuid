import { UuidGenerator } from '@/components/generator';
import { generatePageMetadata } from '@/lib/i18n';

export async function generateMetadata() {
  return generatePageMetadata('en', 'v1', '/generate/v1');
}

export default function GenerateV1Page() {
  return <UuidGenerator initialVersion="v1" lang="en" />;
}
