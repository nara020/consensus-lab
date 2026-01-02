import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { I18nClientProvider } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Consensus Lab - Interactive Blockchain Consensus Visualizer",
  description: "Interactive 3D visualization of blockchain consensus mechanisms: Proof of Work (Bitcoin), Proof of Stake (Ethereum), RAFT (Hyperledger Fabric), and IBFT 2.0 (Hyperledger Besu).",
  keywords: ["blockchain", "consensus", "proof of work", "proof of stake", "raft", "ibft", "bitcoin", "ethereum", "hyperledger", "visualization", "3d", "education"],
  authors: [{ name: "Jinhyeok Kim", url: "https://github.com/nara020" }],
  openGraph: {
    title: "Consensus Lab - Interactive Blockchain Consensus Visualizer",
    description: "Learn blockchain consensus mechanisms through interactive 3D visualizations. Experience PoW, PoS, RAFT, and IBFT 2.0 in action.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Consensus Lab - Interactive Blockchain Consensus Visualizer",
    description: "Learn blockchain consensus mechanisms through interactive 3D visualizations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J9DPZJG4Q8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J9DPZJG4Q8');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#030308]`}
      >
        <I18nClientProvider>{children}</I18nClientProvider>
      </body>
    </html>
  );
}
