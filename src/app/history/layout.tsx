import type { Metadata } from "next";

const siteUrl = "https://consensus-lab.vercel.app";

export const metadata: Metadata = {
  title: "History of Consensus Algorithms",
  description:
    "Timeline of blockchain consensus algorithm development from Byzantine Generals Problem (1982) to Ethereum Pectra, Solana Firedancer, and Monad (2025). 40+ years of distributed systems innovation.",
  keywords: [
    "consensus algorithm history",
    "blockchain timeline",
    "byzantine generals problem",
    "paxos",
    "pbft history",
    "bitcoin whitepaper",
    "ethereum merge",
    "tendermint history",
    "avalanche protocol",
    "layer 2 evolution",
    "blockchain evolution",
  ],
  openGraph: {
    title: "History of Consensus Algorithms | Consensus Lab",
    description:
      "Explore 40+ years of blockchain consensus evolution: from Byzantine Generals Problem to modern Layer 2 scaling solutions.",
    url: `${siteUrl}/history`,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Consensus Algorithm History Timeline",
      },
    ],
  },
  twitter: {
    title: "History of Consensus Algorithms | Consensus Lab",
    description:
      "Explore 40+ years of blockchain consensus evolution: from Byzantine Generals Problem to modern Layer 2 scaling.",
  },
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
