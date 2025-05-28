import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

import type { Database } from "@/types/supabase";
type Tables = Database["public"]["Tables"];

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "user" | "admin";
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  phone?: string | null;
}

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  style: string | null;
  size: string | null;
  placement: string | null;
  idea: string | null;
  date: string | null;
  respond: string | null;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  checkBookingRespond: Booking | null;
  loading: boolean;
  userProfile: Profile | null;
  profileLoading: boolean;
  isLoadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error)
        console.error("AuthContext: Supabase getSession error:", error);

      setUser(session?.user ?? null);
      setSession(session);
      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    let cancelled = false;
    const loadProfile = async () => {
      setProfileLoading(true);
      try {
        if (!user?.email && user.user_metadata.email_verified) {
          setUserProfile(null);
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("AuthContext: Error fetching profile:", error);
          if (error.code === "PGRST116") {
            const { data, error: fetchError } =
              await supabase.auth.getSession();

            const latestSession = data?.session;
            const latestUser = latestSession?.user;

            if (fetchError || !latestUser || !latestSession) {
              console.error(
                "AuthContext: Could not fetch latest user/session to create profile:",
                fetchError
              );
              setUserProfile(null);
              return;
            }

            if (!latestUser.email_confirmed_at) {
              setUserProfile(null);
              return;
            }

            const { data: newProfile, error: createError } = await supabase
              .from("profiles")
              .insert({
                id: latestUser.id,
                full_name: latestUser.user_metadata.full_name || "",
                email: latestUser.email || null,
                role: "user",
                email_verified: true,
              })
              .select();

            if (createError) {
              console.error(
                "AuthContext: Error creating profile after login:",
                createError
              );
              setUserProfile(null);
              return;
            }

            if (newProfile && newProfile.length > 0) {
              setUserProfile(newProfile[0]);
            }
          } else {
            setUserProfile(null);
          }
        } else {
          setUserProfile(profile);
        }
      } catch (err) {
        console.error(
          "AuthContext: Unexpected error loading or creating profile",
          err
        );
        setUserProfile(null);
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    };

    loadProfile();

    const profileSubscription = supabase
      .channel("profile-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new) setUserProfile(payload.new as Profile);
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      profileSubscription.unsubscribe();
    };
  }, [user]);

  const {
    data: checkBookingRespond,
    isLoading: bookingLoading,
    error: bookingError,
  } = useQuery({
    queryKey: ["check-booking-respond", userProfile?.email],
    enabled: !!userProfile?.email,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("email", userProfile.email)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;
      return (data?.[0] ?? null) as Booking | null;
    },
  });

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      console.error("AuthContext: SignUp error:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("AuthContext: SignIn error:", error);
        throw error;
      }

      if (data.user) {
        navigate("/");
      }
    } catch (error: any) {
      console.error("AuthContext: Unexpected SignIn error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("AuthContext: SignOut error:", error);
        throw error;
      }
    } catch (error: any) {
      console.error("AuthContext: Unexpected SignOut error:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) throw error;
  };

  const isLoadingAuth = loading || (user && profileLoading);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signIn,
        signUp,
        signOut,
        resetPassword,
        checkBookingRespond,
        loading,
        userProfile,
        profileLoading,
        isLoadingAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
