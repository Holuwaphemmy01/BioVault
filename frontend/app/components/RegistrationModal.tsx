"use client";

import { useState } from "react";
import { UserRole } from "../services/api";
import { X } from "lucide-react";

interface RegistrationModalProps {
  isOpen: boolean;
  walletAddress: string;
  onRegister: (role: UserRole) => Promise<void>;
  onClose: () => void;
}

export default function RegistrationModal({
  isOpen,
  walletAddress,
  onRegister,
  onClose,
}: RegistrationModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedRole) return;
    setIsSubmitting(true);
    await onRegister(selectedRole);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-gray-900 p-8 shadow-2xl border border-gray-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="mb-2 text-2xl font-bold text-white">Welcome to BioVault</h2>
        <p className="mb-6 text-gray-400">
          Complete your registration to continue.
        </p>

        <div className="mb-6 space-y-4">
          <div className="text-sm text-gray-500 font-mono break-all bg-gray-950 p-3 rounded border border-gray-800">
            {walletAddress}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedRole("patient")}
              className={`flex flex-col items-center justify-center rounded-xl border p-6 transition-all ${
                selectedRole === "patient"
                  ? "border-teal-500 bg-teal-500/10 text-teal-400"
                  : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600 hover:bg-gray-750"
              }`}
            >
              <span className="mb-2 text-3xl">🏥</span>
              <span className="font-semibold">Patient</span>
            </button>
            <button
              onClick={() => setSelectedRole("researcher")}
              className={`flex flex-col items-center justify-center rounded-xl border p-6 transition-all ${
                selectedRole === "researcher"
                  ? "border-blue-500 bg-blue-500/10 text-blue-400"
                  : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600 hover:bg-gray-750"
              }`}
            >
              <span className="mb-2 text-3xl">🔬</span>
              <span className="font-semibold">Researcher</span>
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedRole || isSubmitting}
          className={`w-full rounded-lg py-3 font-semibold transition-all ${
            !selectedRole || isSubmitting
              ? "cursor-not-allowed bg-gray-700 text-gray-500"
              : "bg-gradient-to-r from-teal-400 to-blue-500 text-gray-900 hover:from-teal-300 hover:to-blue-400 shadow-lg shadow-teal-500/20"
          }`}
        >
          {isSubmitting ? "Registering..." : "Complete Registration"}
        </button>
      </div>
    </div>
  );
}
