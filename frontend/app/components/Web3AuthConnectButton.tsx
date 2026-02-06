"use client";

import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { createWalletClient, custom, WalletClient, formatEther } from "viem";
import { arbitrumSepolia } from "viem/chains";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || ""; // Get from https://dashboard.web3auth.io

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x66eee", // hex of 421614
  rpcTarget: "https://sepolia-rollup.arbitrum.io/rpc",
  displayName: "Arbitrum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.arbiscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
};

export default function Web3AuthConnectButton() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({
            config: { chainConfig },
        });

        const web3auth = new Web3Auth({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider,
        });

        await web3auth.initModal();
        setProvider(web3auth.provider);
        setWeb3auth(web3auth);

        if (web3auth.connected) {
          setLoggedIn(true);
          const web3authProvider = web3auth.provider;
          if (web3authProvider) {
             const client = createWalletClient({
                chain: arbitrumSepolia,
                transport: custom(web3authProvider),
             });
             const [addr] = await client.requestAddresses();
             setAddress(addr);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("Web3Auth not initialized yet");
      return;
    }
    try {
      setLoading(true);
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      if (web3auth.connected && web3authProvider) {
        setLoggedIn(true);
        const client = createWalletClient({
            chain: arbitrumSepolia,
            transport: custom(web3authProvider),
        });
        const [addr] = await client.requestAddresses();
        setAddress(addr);
      }
    } catch (error) {
      console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("Web3Auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    setAddress("");
  };

  if (!clientId) {
      return (
        <div className="rounded-full bg-red-500/20 px-4 py-2 text-xs font-medium text-red-200">
          Missing NEXT_PUBLIC_WEB3AUTH_CLIENT_ID
        </div>
      );
  }

  if (loggedIn) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex flex-col text-right">
            <span className="text-xs text-zinc-400">Connected</span>
            <span className="text-sm font-mono text-zinc-200">
                {address.slice(0, 6)}...{address.slice(-4)}
            </span>
        </div>
        <button
          onClick={logout}
          className="rounded-full bg-red-500/10 px-6 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      disabled={loading}
      className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
    >
      {loading ? "Connecting..." : "Connect with Google"}
    </button>
  );
}
