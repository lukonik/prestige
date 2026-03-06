import { useTheme } from "@lonik/themer";

const themeOptions = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
] as const;

export function Theme() {
  const { theme, setTheme } = useTheme();

  return (
    <label className="flex items-center gap-2 text-sm text-gray-600">
      <select
        aria-label="Theme"
        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900"
        onChange={(event) => setTheme(event.target.value)}
        value={theme ?? "system"}
      >
        {themeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
