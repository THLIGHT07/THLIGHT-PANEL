import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

interface ServerData {
  id: number;
  name: string;
  status: "online" | "offline" | "starting" | "stopping";
  players: string;
  version: string;
  plan: string;
  planDetails: {
    ram: number;
    disk: number;
    cpu: number;
  };
  country: string;
  allocatedSpecs?: {
    ram: number;
    disk: number;
    cpu: number;
  };
  ownerEmail: string;
  playerSlots?: number;
  currentPlayers?: number;
  serverConfig?: {
    slots: number;
    gamemode: string;
    difficulty: string;
    whitelist: boolean;
    pvp: boolean;
    cracked: boolean;
    commandblocks: boolean;
    monster: boolean;
    fly: boolean;
    nether: boolean;
  };
}

interface User {
  id: number;
  username: string;
  email: string;
  password?: string; // Store hashed password for validation
  serverCount?: number;
  hasUnlimitedServers?: boolean;
}

interface ServerContextType {
  servers: ServerData[];
  setServers: React.Dispatch<React.SetStateAction<ServerData[]>>;
  currentServerId: number | null;
  setCurrentServerId: (id: number | null) => void;
  getCurrentServer: () => ServerData | null;
  getServerById: (id: number) => ServerData | null;
  updateServerSpecs: (
    serverId: number,
    specs: { ram: number; disk: number; cpu: number },
  ) => void;
  updateServerConfig: (serverId: number, config: any) => void;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<boolean>;
  logout: () => void;
  getUserServers: () => ServerData[];
  canCreateServer: (planType?: string) => boolean;
  getFreeServerCount: () => number;
  getUserServerCount: () => number;
  registeredUsers: User[];
  bannedServers: number[];
  setBannedServers: React.Dispatch<React.SetStateAction<number[]>>;
  bannedEmails: string[];
  setBannedEmails: React.Dispatch<React.SetStateAction<string[]>>;
  isServerBanned: (serverId: number) => boolean;
  isEmailBanned: (email: string) => boolean;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export const useServer = () => {
  const context = useContext(ServerContext);
  if (context === undefined) {
    throw new Error("useServer must be used within a ServerProvider");
  }
  return context;
};

const defaultServers: ServerData[] = [];

export const ServerProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  // Load servers from localStorage or use defaults
  const [servers, setServers] = useState<ServerData[]>(() => {
    if (typeof window !== "undefined") {
      const savedServers = localStorage.getItem("thlight-servers");
      if (savedServers) {
        try {
          return JSON.parse(savedServers);
        } catch (error) {
          console.error("Error parsing saved servers:", error);
        }
      }
    }
    return defaultServers;
  });

  // Banned servers and emails state
  const [bannedServers, setBannedServers] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("thlight-banned-servers");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error("Error parsing banned servers:", error);
        }
      }
    }
    return [];
  });

  const [bannedEmails, setBannedEmails] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("thlight-banned-emails");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error("Error parsing banned emails:", error);
        }
      }
    }
    return [];
  });

  // Load registered users from localStorage
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    if (typeof window !== "undefined") {
      const savedUsers = localStorage.getItem("thlight-registered-users");
      if (savedUsers) {
        try {
          return JSON.parse(savedUsers);
        } catch (error) {
          console.error("Error parsing saved users:", error);
        }
      }
    }
    return [];
  });

  // Load current user from localStorage
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("thlight-user");
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (error) {
          console.error("Error parsing saved user:", error);
        }
      }
    }
    return null;
  });

  const [currentServerId, setCurrentServerId] = useState<number | null>(null);

  // Save servers to localStorage whenever servers change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("thlight-servers", JSON.stringify(servers));
    }
  }, [servers]);

  // Save banned data to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "thlight-banned-servers",
        JSON.stringify(bannedServers),
      );
    }
  }, [bannedServers]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "thlight-banned-emails",
        JSON.stringify(bannedEmails),
      );
    }
  }, [bannedEmails]);

  // Save registered users to localStorage whenever registeredUsers change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "thlight-registered-users",
        JSON.stringify(registeredUsers),
      );
    }
  }, [registeredUsers]);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("thlight-user", JSON.stringify(user));
      } else {
        localStorage.removeItem("thlight-user");
      }
    }
  }, [user]);

  const getCurrentServer = () => {
    return servers.find((server) => server.id === currentServerId) || null;
  };

  const getServerById = (id: number) => {
    return servers.find((server) => server.id === id) || null;
  };

  const updateServerSpecs = (
    serverId: number,
    specs: { ram: number; disk: number; cpu: number },
  ) => {
    setServers((prev) =>
      prev.map((server) =>
        server.id === serverId ? { ...server, allocatedSpecs: specs } : server,
      ),
    );
  };

  const updateServerConfig = (serverId: number, config: any) => {
    setServers((prev) =>
      prev.map((server) =>
        server.id === serverId
          ? {
              ...server,
              serverConfig: config,
              playerSlots: config.slots,
              players: `${server.currentPlayers || 0}/${config.slots}`,
            }
          : server,
      ),
    );
  };

  const getUserServers = () => {
    if (!user?.email) return [];
    return servers.filter((server) => server.ownerEmail === user.email);
  };

  const canCreateServer = (planType?: string) => {
    if (!user) return false;
    if (user.hasUnlimitedServers) return true;

    // Owner email gets unlimited everything for free
    if (user.email === "kaverimaynale@gmail.com") return true;

    // If creating a paid server, always allow
    if (planType && planType !== "Free") return true;

    // For free servers, limit to 1 per user
    return getFreeServerCount() < 1;
  };

  const getUserServerCount = () => {
    if (!user?.email) return 0;
    return servers.filter((server) => server.ownerEmail === user.email).length;
  };

  const getFreeServerCount = () => {
    if (!user?.email) return 0;
    return servers.filter(
      (server) => server.ownerEmail === user.email && server.plan === "Free",
    ).length;
  };

  const isServerBanned = (serverId: number) => {
    return bannedServers.includes(serverId);
  };

  const isEmailBanned = (email: string) => {
    return bannedEmails.includes(email);
  };

  // Authentication functions
  const login = async (email: string, password: string): Promise<boolean> => {
    // Check if email is banned (except for owner)
    if (email !== "kaverimaynale@gmail.com" && isEmailBanned(email)) {
      return false;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find user by email and validate password
    const foundUser = registeredUsers.find(
      (u) => u.email === email && u.password === password,
    );

    if (foundUser) {
      // Create user object without password for current session
      const userData: User = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        // Give owner unlimited access
        hasUnlimitedServers: email === "kaverimaynale@gmail.com",
      };
      setUser(userData);
      return true;
    }
    return false;
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = registeredUsers.find(
      (u) => u.email === email || u.username === username,
    );
    if (existingUser) {
      return false; // User already exists
    }

    // Validate input
    if (username.length >= 3 && email.includes("@") && password.length >= 6) {
      const newUser: User = {
        id: Date.now(),
        username: username,
        email: email,
        password: password, // Store password for validation
      };

      // Add to registered users
      setRegisteredUsers((prev) => [...prev, newUser]);

      // Set as current user (without password)
      const userData: User = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      };
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("thlight-user");
    }
    // Redirect to home page after logout
    navigate("/");
  };

  const isAuthenticated = !!user;

  return (
    <ServerContext.Provider
      value={{
        servers,
        setServers,
        currentServerId,
        setCurrentServerId,
        getCurrentServer,
        getServerById,
        updateServerSpecs,
        updateServerConfig,
        user,
        setUser,
        isAuthenticated,
        login,
        register,
        logout,
        getUserServers,
        canCreateServer,
        getUserServerCount,
        getFreeServerCount,
        registeredUsers,
        bannedServers,
        setBannedServers,
        bannedEmails,
        setBannedEmails,
        isServerBanned,
        isEmailBanned,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};
