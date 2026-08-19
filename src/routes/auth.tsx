import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldError } from "@/components/rankpilot/create-task-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create an account — RankPilot" },
      { name: "description", content: "Access your RankPilot workspace to prioritize SEO opportunities and tasks." },
      { property: "og:title", content: "Sign in or create an account — RankPilot" },
      { property: "og:description", content: "Access your RankPilot workspace to prioritize SEO opportunities and tasks." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [tab, setTab] = useState("signin");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/projects", replace: true });
  }, [loading, session, navigate]);

  const validate = (needName: boolean) => {
    const next: Record<string, string> = {};
    if (needName && !fullName.trim()) next["fullName"] = "Full name is required.";
    if (!email.trim()) next["email"] = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) next["email"] = "Enter a valid email address.";
    if (!password) next["password"] = "Password is required.";
    else if (password.length < 6) next["password"] = "Use at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(false)) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) {
      toast.error("Could not sign in", { description: error.message });
      return;
    }
    toast.success("Welcome back");
    navigate({ to: "/projects", replace: true });
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(true)) return;
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
        data: { full_name: fullName.trim() },
      },
    });
    setBusy(false);
    if (error) {
      toast.error("Could not create account", { description: error.message });
      return;
    }
    if (data.session) {
      toast.success("Account created");
      navigate({ to: "/projects", replace: true });
      return;
    }
    setCheckEmail(true);
    toast.success("Check your email", { description: "Confirm your address to finish signing up." });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to home
          </Link>

          <div className="mt-6 flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            <span className="text-xl font-bold tracking-tight">RankPilot</span>
          </div>

          {checkEmail ? (
            <div className="mt-8 rounded-2xl border border-border bg-card p-6">
              <h1 className="text-lg font-semibold">Confirm your email</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>. Open it to
                activate your account, then sign in.
              </p>
              <Button variant="outline" className="mt-4 w-full" onClick={() => { setCheckEmail(false); setTab("signin"); }}>
                Back to sign in
              </Button>
            </div>
          ) : (
            <>
              <h1 className="mt-8 text-2xl font-bold">SEO intelligence, prioritized.</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Sign in or create an account to open your workspace.
              </p>

              <Tabs value={tab} onValueChange={setTab} className="mt-8">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                  <TabsTrigger value="signup">Create account</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form className="space-y-4" onSubmit={signIn} noValidate>
                    <div>
                      <Label htmlFor="si-email">Work email</Label>
                      <Input id="si-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-11" />
                      <FieldError message={errors["email"]} />
                    </div>
                    <div>
                      <Label htmlFor="si-password">Password</Label>
                      <Input id="si-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 h-11" />
                      <FieldError message={errors["password"]} />
                    </div>
                    <Button type="submit" className="h-11 w-full" disabled={busy}>
                      {busy ? <Loader2 className="size-4 animate-spin" /> : null} Sign in
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form className="space-y-4" onSubmit={signUp} noValidate>
                    <div>
                      <Label htmlFor="su-name">Full name</Label>
                      <Input id="su-name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1.5 h-11" />
                      <FieldError message={errors["fullName"]} />
                    </div>
                    <div>
                      <Label htmlFor="su-email">Work email</Label>
                      <Input id="su-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-11" />
                      <FieldError message={errors["email"]} />
                    </div>
                    <div>
                      <Label htmlFor="su-password">Password</Label>
                      <Input id="su-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 h-11" />
                      <FieldError message={errors["password"]} />
                    </div>
                    <Button type="submit" className="h-11 w-full" disabled={busy}>
                      {busy ? <Loader2 className="size-4 animate-spin" /> : null} Create account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-sidebar px-12 py-16 lg:flex lg:flex-col lg:justify-center">
        <div className="absolute -top-24 -right-24 size-80 rounded-full bg-primary/25 blur-3xl" />
        <div className="relative max-w-md text-sidebar-foreground">
          <p className="text-sm font-semibold text-sidebar-primary">Problem → Recommendation → Task</p>
          <h2 className="mt-3 text-3xl font-bold text-sidebar-accent-foreground">
            Stop reading dashboards. Start shipping SEO work.
          </h2>
          <p className="mt-4 text-sm opacity-75">
            Keyword, content and internal link gaps ranked by impact — each one convertible into an owned, dated task.
          </p>
        </div>
      </div>
    </div>
  );
}