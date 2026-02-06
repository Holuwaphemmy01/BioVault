const API_URL = "http://localhost:5000/api/users";

export type UserRole = "patient" | "researcher";

export interface User {
  _id: string;
  walletAddress: string;
  role: UserRole;
  createdAt: string;
}

export const checkUserRegistration = async (address: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/${address}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error checking registration:", error);
    return null;
  }
};

export const registerUser = async (address: string, role: UserRole): Promise<User | null> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress: address, role }),
    });

    if (!response.ok) throw new Error("Registration failed");
    return await response.json();
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
};
