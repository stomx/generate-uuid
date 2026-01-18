import dynamic from 'next/dynamic';
import { generatePageMetadata } from '@/lib/i18n';

export async function generateMetadata() {
  return generatePageMetadata('ko', 'validate', '/validate');
}

const UuidValidator = dynamic(
  () => import('@/components/validator').then((mod) => mod.UuidValidator),
  {
    loading: () => (
      <div className="flex items-center justify-center h-32 text-text-muted font-mono text-sm">
        <span className="animate-pulse">Loading...</span>
      </div>
    ),
  }
);

export default function ValidatePage() {
  return <UuidValidator />;
}
