import type { Metadata } from "next";
import "./globals.css";
import WalletProvider from "@/components/WalletProvider";

export const metadata: Metadata = {
  title: "AgentGrid — Trustless AI Labor Markets",
  description: "Recursive AI agent subcontracting protocol on Solana. TaskEscrow holds payments, ReputationChain builds trust.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-gray-200 font-sans min-h-screen">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
