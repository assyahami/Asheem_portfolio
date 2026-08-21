// No auth gate — this app uses mock data with no authentication.
// The (protected) route group is used only for organizational purposes.
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
