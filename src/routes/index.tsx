import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, FileSearch, Gauge, Link2, ListChecks, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RankPilot — Turn SEO data into prioritized work" },
      {
        name: "description",
        content: "RankPilot scores keyword, content and internal link opportunities, then turns each one into an owned SEO task.",
      },
      { property: "og:title", content: "RankPilot — Turn SEO data into prioritized work" },
      {
        property: "og:description",
        content: "RankPilot scores keyword, content and internal link opportunities, then turns each one into an owned SEO task.",
      },
    ],
  }),
  component: LandingPage,
});

const features = [
  { icon: Gauge, title: "Priority Actions first", body: "The dashboard answers one question: what should I do next?" },
  { icon: FileSearch, title: "Technical audit", body: "Crawl issues grouped by severity with fixes you can assign." },
  { icon: BarChart3, title: "Keyword opportunities", body: "Position, volume, difficulty and momentum scored together." },
  { icon: Link2, title: "Internal link gaps", body: "Suggested links that push authority to pages with upside." },
  { icon: ListChecks, title: "One click to a task", body: "Every recommendation converts into an owned, dated task." },
  { icon: Sparkles, title: "Manager review", body: "Completed work rolls up for approval across the portfolio." },
];

function LandingPage() {
  const { session, loading } = useAuth();
  const signedIn = !loading && !!session;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            <span className="text-base font-bold tracking-tight">RankPilot</span>
          </span>
          {signedIn ? (
            <Button asChild size="sm">
              <Link to="/projects">Open dashboard</Link>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth">Get started</Link>
              </Button>
            </div>
          )}
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-sidebar text-sidebar-foreground">
          <div className="absolute -top-32 -right-24 size-96 rounded-full bg-primary/25 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
            <p className="text-sm font-semibold text-sidebar-primary">SEO opportunity & prioritization</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-sidebar-accent-foreground sm:text-5xl">
              Stop reading SEO dashboards. Start shipping SEO work.
            </h1>
            <p className="mt-5 max-w-2xl text-base opacity-80">
              RankPilot scores every keyword, content and internal link opportunity across your sites, then turns the
              ones that matter into assigned, dated tasks your team can actually finish.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12">
                <Link to={signedIn ? "/projects" : "/auth"}>
                  {signedIn ? "Open dashboard" : "Create your account"} <ArrowRight className="size-4" />
                </Link>
              </Button>
              {signedIn ? null : (
                <Button asChild size="lg" variant="outline" className="h-12 border-sidebar-border bg-transparent text-sidebar-accent-foreground hover:bg-sidebar-accent">
                  <Link to="/auth">I already have an account</Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Everything an SEO team argues about, ranked</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            One workspace for audits, keywords, content and links — with a shared definition of what comes first.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <span className="flex size-10 items-center justify-center rounded-xl bg-info-soft text-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-muted/50">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Ready to see your next best SEO action?</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">Create an account in under a minute.</p>
            </div>
            <Button asChild size="lg" className="h-12">
              <Link to={signedIn ? "/projects" : "/auth"}>
                {signedIn ? "Open dashboard" : "Get started free"} <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <p className="mx-auto max-w-6xl px-4 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} RankPilot. Dashboard data shown in the app is sample data.
        </p>
      </footer>
    </div>
  );
}
