import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl = process.env.APP_URL ?? "https://mykhata-three.vercel.app";
const description =
  "Track income and expenses, ask an AI assistant about your spending, and get a branded PDF summary emailed to you every month.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "MyKhata",
  description,
  openGraph: {
    title: "MyKhata — Personal finance, simplified",
    description,
    url: siteUrl,
    siteName: "MyKhata",
    type: "website",
    images: ["/link-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyKhata — Personal finance, simplified",
    description,
    images: ["/link-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
