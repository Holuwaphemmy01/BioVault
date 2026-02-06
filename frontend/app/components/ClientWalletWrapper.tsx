"use client";

import dynamic from "next/dynamic";

const Web3AuthConnectButton = dynamic(
  () => import("./Web3AuthConnectButton"),
  {
    ssr: false,
    loading: () => <div className="p-4 text-center">Loading Wallet...</div>,
  }
);

export default function ClientWalletWrapper() {
  return <Web3AuthConnectButton />;
}
