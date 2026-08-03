import type { Metadata } from "next";
import { headers } from "next/headers";
import { Archivo, Archivo_Black } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ variable: "--font-body", subsets: ["latin"] });
const archivoBlack = Archivo_Black({ variable: "--font-display", weight: "400", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;
  const title = "Students Organizing for Syria | Shape the Future";
  const description = "A student-led movement building community power and the next generation of Syrian advocates, leaders, and changemakers.";
  return {
    title,
    description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title, description, type: "website", images: [{ url: image, width: 1200, height: 630, alt: "We are shaping the future — Students Organizing for Syria" }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${archivo.variable} ${archivoBlack.variable}`}>{children}</body></html>;
}
