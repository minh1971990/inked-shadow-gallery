import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type ResetInputs = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ResetInputs>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirm: "" },
    mode: "onChange",
  });

  const handleSubmit = async (data: ResetInputs) => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black/95">
      <div className="w-full max-w-md bg-black/95 border border-white/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Reset Password</h2>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <div>
            <label className="block text-white/80 text-sm mb-2">
              New Password
            </label>
            <Input
              type="password"
              {...form.register("password", {
                onChange: () => form.trigger("password"),
              })}
              className="bg-white/5 border-white/20 text-white"
              required
            />
            {form.formState.errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-2">
              Confirm New Password
            </label>
            <Input
              type="password"
              {...form.register("confirm", {
                onChange: () => form.trigger("confirm"),
              })}
              className="bg-white/5 border-white/20 text-white"
              required
            />
            {form.formState.errors.confirm && (
              <p className="text-red-400 text-sm mt-1">
                {form.formState.errors.confirm.message}
              </p>
            )}
          </div>
          {error && (
            <Alert className="bg-red-900/50 text-red-200 border-red-800">
              {error}
            </Alert>
          )}
          {success && (
            <Alert className="bg-green-900/50 text-green-200 border-green-800">
              Password reset successful! Redirecting...
            </Alert>
          )}
          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-white/90 py-6"
            disabled={loading || success}
          >
            {loading ? (
              "Resetting..."
            ) : success ? (
              <span className="flex items-center justify-center">
                Redirecting
                <span className="ml-1 animate-pulse">...</span>
              </span>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
