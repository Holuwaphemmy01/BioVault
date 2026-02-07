const API_URL = "http://localhost:5000/api/users";

export type UserRole = "patient" | "researcher";

export interface User {
  _id: string;
  walletAddress: string;
  role: UserRole;
  token: string; // Added token field
}

export const loginUser = async (walletAddress: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress }),
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Error logging in:", error);
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

export const getProtectedData = async (token: string): Promise<any[] | null> => {
    try {
        const response = await fetch(`${API_URL}/protected-data`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error("Failed to fetch protected data");
        return await response.json();
    } catch (error) {
        console.error("Error fetching protected data:", error);
        return null;
    }
};
