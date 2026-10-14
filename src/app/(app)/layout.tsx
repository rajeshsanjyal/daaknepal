import { RequireAuth } from "@/components/shell/require-auth";

export const instant = false;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
