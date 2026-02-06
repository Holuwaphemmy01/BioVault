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

import PatientDashboard from "./PatientDashboard";
import RegistrationModal from "./RegistrationModal";
import { checkUserRegistration, registerUser, UserRole, User } from "../services/api";

export default function Web3AuthConnectButton() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  // ... (keep init logic same)

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

  useEffect(() => {
    if (address && loggedIn) {
      checkUser();
    }
  }, [address, loggedIn]);

  const checkUser = async () => {
    if (!address) return;
    const existingUser = await checkUserRegistration(address);
    if (existingUser) {
      setUser(existingUser);
    } else {
      setShowRegistration(true);
    }
  };

  const handleRegister = async (role: UserRole) => {
    if (!address) return;
    const newUser = await registerUser(address, role);
    if (newUser) {
      setUser(newUser);
      setShowRegistration(false);
    }
  };

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

  if (loggedIn && provider) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col h-screen w-full bg-black animate-in fade-in duration-300">
         {showRegistration ? (
           <RegistrationModal
             isOpen={showRegistration}
             walletAddress={address}
             onRegister={handleRegister}
             onClose={() => logout()}
           />
         ) : (
           <PatientDashboard provider={provider} />
         )}
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

  return (
    <button
      onClick={login}
      disabled={loading}
      className="rounded bg-brand-cyan px-6 py-2 text-sm font-bold text-brand-dark shadow-lg shadow-brand-cyan/20 hover:bg-brand-cyan-hover hover:scale-105 transition-all disabled:opacity-50"
    >
      {loading ? "CONNECTING..." : "CONNECT WALLET"}
    </button>
  );
}
