import { useTheme } from "@lonik/themer";
import { useHydrated } from "@tanstack/react-router";
import { Moon, Sun, SunMoon } from "lucide-react";

const themeOrder = ["system", "light", "dark"] as const;
type ThemeValue = (typeof themeOrder)[number];

export function Theme() {
  const { theme, setTheme } = useTheme();
  const currentTheme: ThemeValue = (theme as ThemeValue) ?? "system";
  const hydrated = useHydrated();

  const nextTheme = (value: ThemeValue): ThemeValue => {
    const index = themeOrder.indexOf(value);
    return themeOrder[(index + 1) % themeOrder.length]!;
  };

  const icon =
    currentTheme === "light" ? (
      <Sun size={16} />
    ) : currentTheme === "dark" ? (
      <Moon size={16} />
    ) : (
      <SunMoon size={16} />
    );

  return (
    <button
      suppressHydrationWarning
      type="button"
      aria-label={`Theme: ${currentTheme}. Click to switch theme`}
      title={`Theme: ${currentTheme}`}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-default-200 bg-default-50 text-soft hover:bg-default-100 cursor-pointer"
      onClick={() => setTheme(nextTheme(currentTheme))}
    >
      {hydrated && icon}
    </button>
  );
}
