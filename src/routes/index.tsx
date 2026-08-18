import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BarChart3, ListChecks, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/rankpilot/create-task-dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — RankPilot SEO dashboard" },
      { name: "description", content: "Sign in to RankPilot and turn SEO data into prioritized tasks." },
      { property: "og:title", content: "Sign in — RankPilot SEO dashboard" },
      { property: "og:description", content: "Sign in to RankPilot and turn SEO data into prioritized tasks." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!email.trim()) next["email"] = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) next["email"] = "Enter a valid email address.";
    if (!password) next["password"] = "Password is required.";
    setErrors(next);
    if (Object.keys(next).length) return;
    navigate({ to: "/projects" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            <span className="text-xl font-bold tracking-tight">RankPilot</span>
          </div>
          <h1 className="mt-8 text-2xl font-bold">SEO intelligence, prioritized.</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to see what SEO work matters most this week.
          </p>

          <form className="mt-8 space-y-4" onSubmit={login} noValidate>
            <div>
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="sarah@acmedigital.com"
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 h-11"
              />
              <FieldError message={errors["email"]} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 h-11"
              />
              <FieldError message={errors["password"]} />
            </div>
            <Button type="submit" className="h-11 w-full">
              Log in <ArrowRight className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full"
              onClick={() => navigate({ to: "/projects" })}
            >
              Use Demo Account
            </Button>
          </form>

          <p className="mt-6 text-xs text-muted-foreground">
            This is a frontend prototype. No account is created, no credentials are stored, and all data shown is
            mock data.
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-sidebar px-12 py-16 lg:flex lg:flex-col lg:justify-center">
        <div className="absolute -top-24 -right-24 size-80 rounded-full bg-primary/25 blur-3xl" />
        <div className="relative max-w-md text-sidebar-foreground">
          <p className="text-sm font-semibold text-sidebar-primary">Problem → Recommendation → Task</p>
          <h2 className="mt-3 text-3xl font-bold text-sidebar-accent-foreground">
            Stop reading dashboards. Start shipping SEO work.
          </h2>
          <div className="mt-10 space-y-4">
            {[
              { icon: BarChart3, title: "Opportunities, scored", body: "Keyword, content and internal link gaps ranked by impact." },
              { icon: ListChecks, title: "One click to a task", body: "Every recommendation converts into an owned, dated task." },
              { icon: Sparkles, title: "Priority Actions first", body: "The dashboard answers: what should I do next?" },
            ].map((f) => (
              <div key={f.title} className="flex gap-3 rounded-2xl border border-sidebar-border p-4">
                <f.icon className="mt-0.5 size-5 text-sidebar-primary" />
                <div>
                  <p className="font-semibold text-sidebar-accent-foreground">{f.title}</p>
                  <p className="text-sm opacity-75">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
