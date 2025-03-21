import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
