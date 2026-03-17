import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Code2,
  FileText,
  FolderTree,
  Github,
  Layers,
  PaintBucket,
  Palette,
  PanelLeft,
  RefreshCw,
  Rocket,
  Search,
  ShieldCheck,
  Sliders,
  Sparkles,
  SunMoon,
  Zap,
} from "lucide-react";
import config from "virtual:prestige/config";
import Logo from "../assets/logo.png?$oh";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

const features = [
  {
    title: "Markdown Power",
    description:
      "MD, MDX, and GFM compilation integrated out of the box. Extend capabilities via rehype and remark plugins.",
    icon: FileText,
  },
  {
    title: "Powered by Vite",
    description:
      "Built on Vite, so the entire Vite ecosystem is at your disposal.",
    icon: Zap,
  },
  {
    title: "TypeScript Native",
    description:
      "First-class TypeScript support. Written entirely in TypeScript.",
    icon: Code2,
  },
  {
    title: "Tailwind First",
    description:
      "First-class Tailwind CSS support. Prestige is designed with Tailwind.",
    icon: Palette,
  },
  {
    title: "Dark & Light Modes",
    description:
      "Dark and light theme modes perfectly balanced for readability.",
    icon: SunMoon,
  },
  {
    title: "Color Schemes",
    description:
      "Multiple color schemes. All Tailwind colors are included, and you can easily add your own.",
    icon: PaintBucket,
  },
  {
    title: "DocSearch Built-in",
    description:
      "Algolia DocSearch integration built right in for rapid information retrieval.",
    icon: Search,
  },
  {
    title: "Auto Sidebars",
    description: "Automatically generate sidebars based on collection content.",
    icon: PanelLeft,
  },
  {
    title: "Auto Pages",
    description: "Automatically generate pages based on directory structure.",
    icon: FolderTree,
  },
  {
    title: "Collections Architecture",
    description:
      "Different collections can have independent navigation menus and sidebars (e.g., /docs/*, /api/*).",
    icon: Layers,
  },
  {
    title: "Hot Reloading",
    description:
      "Markdown changes instantly update the UI. No waiting, no refreshing.",
    icon: RefreshCw,
  },
  {
    title: "Blazing Fast SSG",
    description:
      "Statically analyzed and generated HTML. Content routes are lazy-loaded, delivering incredibly fast pages.",
    icon: Rocket,
  },
  {
    title: "Type-Safe Routes",
    description:
      "File-based routes via TanStack Router deliver full IntelliSense and type safety.",
    icon: ShieldCheck,
  },
  {
    title: "Fully Customizable",
    description:
      "A thin layer over TanStack Start. Easily add or remove features like a regular project.",
    icon: Sliders,
  },
  {
    title: "Beautiful by Default",
    description:
      "Carefully crafted typography, spacing, and micro-interactions. We hope you'll like it.",
    icon: Sparkles,
  },
];

function RouteComponent() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-primary-500/30 overflow-hidden relative">
      {/* Background Ambience Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-400/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-blue-400/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] rounded-full bg-indigo-400/10 blur-[150px]" />
      </div>

      <main className="relative z-10 container mx-auto px-6 pt-32 pb-24 lg:pt-48">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-40">
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-200 mb-8 text-sm text-slate-600 shadow-sm">
              <Sparkles size={16} className="text-primary-500" />
              <span className="font-medium">
                Introducing the definitive documentation framework
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1] drop-shadow-sm">
              Meet{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-blue-600">
                {config.title}
              </span>
              .
            </h1>

            <p className="text-xl lg:text-2xl text-slate-600 mb-12 max-w-2xl leading-relaxed font-light">
              Your great project deserves documentation that feels like magic.
              Built on Vite and TanStack, beautifully designed by default.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link to="/docs/introduction" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto rounded-full px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary-500/20 flex items-center justify-center gap-3">
                  Get Started <ArrowRight size={18} />
                </button>
              </Link>
              <a
                href="https://github.com/lukonik/Prestige"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto"
              >
                <button className="w-full sm:w-auto rounded-full px-8 py-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-all hover:scale-105 active:scale-95 shadow-sm flex items-center justify-center gap-3">
                  <Github size={20} />
                  <span>Star on GitHub</span>
                </button>
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 w-full max-w-xl lg:max-w-2xl relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/50 bg-white/40 ring-1 ring-slate-900/5 shadow-2xl group flex items-center justify-center">
              <div className="absolute inset-0 bg-linear-to-br from-white/40 to-transparent pointer-events-none z-10 mix-blend-overlay" />
              <div className="w-full h-[400px] lg:h-[600px] flex items-center justify-center p-8 lg:p-16">
                <Logo
                  alt="Prestige Logo"
                  className="w-full max-w-[320px] lg:max-w-[400px] h-auto object-contain transition-transform duration-2000 group-hover:scale-110 ease-out drop-shadow-2xl"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-slate-900/5 to-transparent z-10 pointer-events-none" />
            </div>
            {/* Ambient Glow behind image */}
            <div className="absolute -inset-4 bg-linear-to-br from-primary-400/30 to-blue-400/30 blur-3xl rounded-[3rem] -z-10 opacity-60" />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Gravity-defying features.
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
              Everything you need to build stunning, incredibly fast
              documentation sites without the usual boilerplate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl border border-slate-200 bg-white hover:bg-slate-50/80 transition-all duration-500 flex flex-col h-full hover:border-primary-200 hover:shadow-xl hover:shadow-primary-600/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-32 bg-linear-to-bl from-primary-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-full blur-3xl translate-x-10 -translate-y-10" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center mb-8 text-primary-600 group-hover:bg-primary-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 ease-out shadow-sm">
                    <feature.icon size={26} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-light mt-auto text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-40 pt-32 pb-16 border-t border-slate-200 flex flex-col items-center text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-primary-400/30 to-transparent" />
          <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-8 tracking-tight">
            Ready to break free?
          </h2>
          <p className="text-xl text-slate-600 mb-12 font-light max-w-xl leading-relaxed">
            Start building your documentation with Prestige today and experience
            the difference.
          </p>
          <Link to="/docs/introduction">
            <button className="rounded-full px-12 py-5 bg-primary-600 text-white hover:bg-primary-700 font-semibold text-lg transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-primary-500/20 flex items-center justify-center gap-3">
              Build your docs now <ArrowRight size={20} />
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
