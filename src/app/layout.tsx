import type { Metadata, Viewport } from "next";
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

const siteUrl = "https://consensus-lab.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030308",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Consensus Lab - Interactive Blockchain Consensus Visualizer",
    template: "%s | Consensus Lab",
  },
  description: "Interactive 3D visualization of 10+ blockchain consensus mechanisms: PoW (Bitcoin), PoS (Ethereum), RAFT, QBFT, Tendermint, Avalanche, Sui/Narwhal-Bullshark, Optimistic Rollup, ZK Rollup, and Ripple RPCA.",
  keywords: [
    // Core concepts
    "blockchain consensus",
    "consensus algorithm",
    "distributed systems",
    "byzantine fault tolerance",
    "BFT",
    // Layer 1 - PoW
    "proof of work",
    "bitcoin",
    "nakamoto consensus",
    "SHA-256",
    // Layer 1 - PoS
    "proof of stake",
    "ethereum",
    "casper ffg",
    "lmd ghost",
    "validator",
    "staking",
    // Enterprise
    "raft consensus",
    "qbft",
    "ibft",
    "hyperledger fabric",
    "hyperledger besu",
    "permissioned blockchain",
    // Cosmos ecosystem
    "tendermint",
    "cosmos",
    "cometbft",
    // Avalanche
    "avalanche consensus",
    "snowball protocol",
    "probabilistic consensus",
    // Sui
    "sui blockchain",
    "narwhal bullshark",
    "dag consensus",
    "mysticeti",
    // Layer 2
    "layer 2",
    "rollup",
    "optimistic rollup",
    "arbitrum",
    "optimism",
    "zk rollup",
    "zksync",
    "starknet",
    "fraud proof",
    "validity proof",
    // Ripple
    "ripple",
    "xrp ledger",
    "rpca",
    "federated consensus",
    // Educational
    "blockchain education",
    "consensus visualization",
    "3d visualization",
    "interactive learning",
    "crypto education",
  ],
  authors: [{ name: "Jinhyeok Kim", url: "https://github.com/nara020" }],
  creator: "Jinhyeok Kim",
  publisher: "Consensus Lab",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "en": siteUrl,
      "ko": `${siteUrl}?lang=ko`,
    },
  },
  openGraph: {
    title: "Consensus Lab - Interactive Blockchain Consensus Visualizer",
    description: "Learn 10+ blockchain consensus mechanisms through interactive 3D visualizations. PoW, PoS, RAFT, QBFT, Tendermint, Avalanche, Sui, Optimistic/ZK Rollups, and more.",
    type: "website",
    url: siteUrl,
    siteName: "Consensus Lab",
    locale: "en_US",
    alternateLocale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Consensus Lab - Interactive Blockchain Consensus Visualizer",
    description: "Learn 10+ blockchain consensus mechanisms through interactive 3D visualizations.",
    creator: "@consensus_lab",
  },
  category: "Education",
  classification: "Blockchain Education",
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Consensus Lab",
  description:
    "Interactive 3D visualization of blockchain consensus mechanisms including PoW, PoS, RAFT, QBFT, Tendermint, Avalanche, Sui, and Layer 2 solutions.",
  url: siteUrl,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Jinhyeok Kim",
    url: "https://github.com/nara020",
  },
  educationalUse: ["self-study", "demonstration", "research"],
  learningResourceType: "interactive visualization",
  teaches: [
    "Blockchain Consensus Mechanisms",
    "Proof of Work",
    "Proof of Stake",
    "Byzantine Fault Tolerance",
    "Distributed Systems",
  ],
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Consensus Lab",
  url: siteUrl,
  logo: `${siteUrl}/opengraph-image`,
  sameAs: ["https://github.com/nara020/consensus-lab"],
};

// FAQ Schema for LLMs and Google Rich Results
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is blockchain consensus?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Blockchain consensus is a mechanism that allows distributed network participants to agree on a single version of truth without a central authority. It ensures all nodes have the same data and prevents double-spending. Common mechanisms include Proof of Work (PoW), Proof of Stake (PoS), and Byzantine Fault Tolerant (BFT) protocols.",
      },
    },
    {
      "@type": "Question",
      name: "What is Proof of Work (PoW)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Proof of Work is a consensus mechanism where miners compete to solve cryptographic puzzles using computational power. The first miner to find a valid hash gets to add the next block and earn rewards. Bitcoin uses PoW with SHA-256 hashing. It provides strong security but consumes significant energy.",
      },
    },
    {
      "@type": "Question",
      name: "What is Proof of Stake (PoS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Proof of Stake is a consensus mechanism where validators are chosen to create blocks based on their staked cryptocurrency. Ethereum transitioned to PoS in 2022 (The Merge), using Casper FFG for finality and LMD GHOST for fork choice. Validators stake 32 ETH and can be slashed for misbehavior.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between BFT and CFT consensus?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CFT (Crash Fault Tolerant) like RAFT handles node crashes but not malicious behavior - it assumes all nodes are honest but may fail. BFT (Byzantine Fault Tolerant) like PBFT/QBFT handles both crashes AND malicious nodes - it can tolerate up to 1/3 of nodes being Byzantine (evil). BFT requires more messages (O(n²)) but provides stronger guarantees.",
      },
    },
    {
      "@type": "Question",
      name: "What are Optimistic Rollups?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Optimistic Rollups are Layer 2 scaling solutions that assume transactions are valid by default (optimistic). They post transaction data to Ethereum L1 and have a 7-day challenge period where anyone can submit a fraud proof if they detect invalid state transitions. Examples include Arbitrum, Optimism, and Base.",
      },
    },
    {
      "@type": "Question",
      name: "What are ZK Rollups?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ZK Rollups use zero-knowledge proofs (SNARKs or STARKs) to mathematically prove transaction validity. Unlike Optimistic Rollups, they don't need a challenge period - once the proof is verified on L1, the state is immediately final. Examples include zkSync Era and StarkNet.",
      },
    },
    {
      "@type": "Question",
      name: "What is Tendermint consensus?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tendermint (now CometBFT) is a BFT consensus algorithm designed for blockchain. It uses a round-based approach with Propose → Prevote → Precommit phases, requiring 2/3+ validator votes. It provides instant finality and powers 100+ chains in the Cosmos ecosystem via the Cosmos SDK.",
      },
    },
    {
      "@type": "Question",
      name: "How does Avalanche consensus work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Avalanche uses a novel probabilistic consensus called Snowball. Nodes repeatedly sample random peers (k=20) and update their preference based on majority responses. After β=20 consecutive rounds with the same result, the decision is finalized. This achieves sub-second finality with O(log n) message complexity.",
      },
    },
    {
      "@type": "Question",
      name: "What is Narwhal-Bullshark in Sui?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Narwhal-Bullshark is Sui's consensus architecture. Narwhal is a DAG-based mempool that separates data availability from ordering. Bullshark orders transactions by identifying anchor vertices in the DAG without additional messages. This enables 300K+ TPS with parallel transaction execution.",
      },
    },
    {
      "@type": "Question",
      name: "What consensus algorithms does Consensus Lab visualize?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Consensus Lab provides interactive 3D visualizations of 10+ consensus algorithms: Proof of Work (Bitcoin), Proof of Stake (Ethereum), RAFT (Hyperledger Fabric), QBFT/IBFT 2.0 (Hyperledger Besu), Tendermint (Cosmos), Avalanche Snowball, Sui Narwhal-Bullshark, Optimistic Rollup (Arbitrum/Optimism), ZK Rollup (zkSync), and Ripple RPCA.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
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
