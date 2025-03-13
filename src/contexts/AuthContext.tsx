import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type UserRole = "admin" | "doctor" | "nurse" | "staff";

interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  signUp: (email: string, password: string, full_name: string, role: UserRole) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up the initial session and user
    const initializeAuth = async () => {
      try {
        setLoading(true);
        // First, check if there's an existing session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          console.log("Found existing session", currentSession);
          setSession(currentSession);
          setUser(currentSession.user);
          // Fetch the user's profile or create one from metadata if fetch fails
          await fetchProfile(currentSession.user.id);
        } else {
          console.log("No session found");
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
        setInitialCheckDone(true);
      }
    };
    
    initializeAuth();
    
    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession ? "session exists" : "no session");
        
        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);
          // Force a fetch of the profile to ensure we have the latest data
          await fetchProfile(newSession.user.id);
          
          // On sign-in, redirect to dashboard
          if (event === "SIGNED_IN") {
            toast.success("Successfully signed in");
            navigate("/");
          }
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
          
          // On sign-out, redirect to auth page
          if (event === "SIGNED_OUT") {
            navigate("/auth");
          }
        }
        
        setLoading(false);
      }
    );
    
    // Clean up the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
        
        // Create a fallback profile using user metadata if available
        if (user && user.user_metadata) {
          const role = user.user_metadata.role as UserRole;
          const full_name = user.user_metadata.full_name as string;
          
          if (role) {
            console.log("Creating fallback profile from user metadata:", { role, full_name });
            setProfile({
              id: userId,
              role: role,
              full_name: full_name || null,
              created_at: new Date().toISOString()
            });
          }
        }
        return;
      }
      
      console.log("Profile data fetched successfully:", data);
      setProfile(data as Profile);
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      
      // Create a fallback profile using user metadata if available
      if (user && user.user_metadata) {
        const role = user.user_metadata.role as UserRole;
        const full_name = user.user_metadata.full_name as string;
        
        if (role) {
          console.log("Creating fallback profile from user metadata after error:", { role, full_name });
          setProfile({
            id: userId,
            role: role,
            full_name: full_name || null,
            created_at: new Date().toISOString()
          });
        }
      }
    }
  };
  
  const signUp = async (email: string, password: string, full_name: string, role: UserRole) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role
          }
        }
      });
      
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Sign in error:", error);
      } else {
        console.log("Sign in successful", data);
      }
      
      return { data, error };
    } catch (error) {
      console.error("Unexpected sign in error:", error);
      return { data: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };
  
  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    session,
    user,
    profile,
    signUp,
    signIn,
    signOut,
    loading
  };
  
  // Only render children when initial check is done to prevent flashing
  if (!initialCheckDone) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
