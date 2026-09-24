import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";

export const metadata = { title: "Product Admin Dashboard", description: "DummyJSON Product Admin Dashboard" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AuthProvider><AuthGuard>{children}</AuthGuard></AuthProvider></body></html>;
}