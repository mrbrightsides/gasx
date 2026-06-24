import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ResponseLogger } from "@/components/response-logger";
import { ThemeProvider } from "@/components/theme-provider";
import { cookies } from "next/headers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestId = cookies().get("x-request-id")?.value;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {requestId && <meta name="x-request-id" content={requestId} />}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ResponseLogger />
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
        title: "STC GasX Cost Comparator",
        description: "STC GasX compares on-chain gas fees with off-chain transaction costs. Visualize and analyze costs to find the cheaper option. Supports CSV import, SIWE login, and downloadable charts.",
        other: { "fc:frame": JSON.stringify({"version":"next","imageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_64e57aa9-ff79-43bc-b8d0-6792de312979-CKkJag0QTJaUHYwDmBGfa3eraNl2fz","button":{"title":"Open with Ohara","action":{"type":"launch_frame","name":"STC GasX Cost Comparator","url":"https://both-stream-949.app.ohara.ai","splashImageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg","splashBackgroundColor":"#ffffff"}}}
        ) }
    };
