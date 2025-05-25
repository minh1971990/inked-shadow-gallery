import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "user" | "admin";
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  userProfile: Profile | null;
  profileLoading: boolean;
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
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setSession(session);
      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
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
          if (error.code === "PGRST116") {
            console.log(
              "AuthContext: Profile not found, attempting to create."
            );

            // Fetch latest user data and session right before creating profile
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

            console.log(
              "AuthContext: Latest user data for profile creation:",
              latestUser
            );
            console.log(
              "AuthContext: Latest session for profile creation:",
              latestSession
            );

            // Double check email confirmed status from latest user data
            if (!latestUser.email_confirmed_at) {
              console.log(
                "AuthContext: Email not confirmed from latest user data, not creating profile."
              );
              setUserProfile(null);
              return;
            }

            console.log(
              "AuthContext: User metadata for new profile:",
              latestUser.user_metadata
            );
            console.log(
              "AuthContext: full_name from metadata:",
              latestUser.user_metadata.full_name
            );
            console.log(
              "AuthContext: phone from metadata:",
              latestUser.user_metadata.phone
            );

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
              console.log(
                "AuthContext: New profile created successfully:",
                newProfile[0]
              );
              setUserProfile(newProfile[0]);
            } else {
              console.log(
                "AuthContext: Profile insert successful but no data returned."
              );
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
        if (!cancelled) setProfileLoading(false);
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

    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        navigate("/");
      }
    } catch (error: any) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signIn,
        signUp,
        signOut,
        loading,
        userProfile,
        profileLoading,
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
