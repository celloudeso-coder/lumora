import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s | Administration LUMORA" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="admin-root min-h-dvh flex-1">{children}</div>;
}
