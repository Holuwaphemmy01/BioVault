"use client";

import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { createWalletClient, custom } from "viem";
import { arbitrumSepolia } from "viem/chains";

import PatientDashboard from "./PatientDashboard";
import ResearcherDashboard from "./ResearcherDashboard";
import RegistrationModal from "./RegistrationModal";
import { loginUser, registerUser, UserRole, User } from "../services/api";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x66eee",
  rpcTarget: "https://sepolia-rollup.arbitrum.io/rpc",
  displayName: "Arbitrum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.arbiscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
};

export default function Web3AuthConnectButton() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [address, setAddress] = useState<string>("");

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
        setWeb3auth(web3auth);

        if (web3auth.connected && web3auth.provider) {
          setProvider(web3auth.provider);
          const client = createWalletClient({
            chain: arbitrumSepolia,
            transport: custom(web3auth.provider),
          });
          const [addr] = await client.requestAddresses();
          setAddress(addr);
          handleLogin(addr);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const handleLogin = async (walletAddress: string) => {
    setLoading(true);
    const existingUser = await loginUser(walletAddress);
    if (existingUser) {
      setUser(existingUser);
      localStorage.setItem("authToken", existingUser.token);
    } else {
      setShowRegistration(true);
    }
    setLoading(false);
  };

  const handleRegister = async (role: UserRole) => {
    if (!address) return;
    const newUser = await registerUser(address, role);
    if (newUser) {
      setUser(newUser);
      localStorage.setItem("authToken", newUser.token);
      setShowRegistration(false);
    }
  };

  const connect = async () => {
    if (!web3auth) return;
    try {
      setLoading(true);
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      if (web3auth.connected && web3authProvider) {
        const client = createWalletClient({
          chain: arbitrumSepolia,
          transport: custom(web3authProvider),
        });
        const [addr] = await client.requestAddresses();
        setAddress(addr);
        handleLogin(addr);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!web3auth) return;
    await web3auth.logout();
    setProvider(null);
    setUser(null);
    setAddress("");
    localStorage.removeItem("authToken");
  };

  if (!clientId) {
    return (
      <div className="rounded-full bg-red-500/20 px-4 py-2 text-xs font-medium text-red-200">
        Missing NEXT_PUBLIC_WEB3AUTH_CLIENT_ID
      </div>
    );
  }

  if (user && provider) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col h-screen w-full bg-black animate-in fade-in duration-300">
        {user.role === "patient" && <PatientDashboard provider={provider} />}
        {user.role === "researcher" && <ResearcherDashboard token={user.token} />}
        
        <div className="fixed bottom-4 left-4 z-[110]">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-xs font-bold transition-all backdrop-blur-md"
          >
            LOGOUT SESSION
          </button>
        </div>
      </div>
    );
  }

  if (showRegistration) {
    return (
      <RegistrationModal
        isOpen={showRegistration}
        walletAddress={address}
        onRegister={handleRegister}
        onClose={() => {
          setShowRegistration(false);
          logout();
        }}
      />
    );
  }

  return (
    <button
      onClick={connect}
      disabled={loading}
      className="rounded bg-brand-cyan px-6 py-2 text-sm font-bold text-brand-dark shadow-lg shadow-brand-cyan/20 hover:bg-brand-cyan-hover hover:scale-105 transition-all disabled:opacity-50"
    >
      {loading ? "AUTHENTICATING..." : "CONNECT WALLET"}
    </button>
  );
}
