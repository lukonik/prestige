import { Code } from "../code/code";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../tabs/tabs"; // Adjust import path

type PackageManager = "npm" | "pnpm" | "yarn" | "bun";
type CommandType = "add" | "create" | "exec" | "run";

export interface PackageManagersProps {
  /** The name of the package (e.g., "@lonik/themer") */
  pkg?: string;
  /** The type of command to generate. Defaults to "add" */
  type?: CommandType;
  /** Whether this is a development dependency (-D) */
  dev?: boolean;
  /** Additional arguments to append to the command */
  args?: string;
  className?: string;
}

const MANAGERS: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];

function generateCommand(
  pm: PackageManager,
  type: CommandType,
  pkg?: string,
  dev?: boolean,
  args?: string,
) {
  const parts: string[] = [];

  switch (type) {
    case "add":
      parts.push(pm === "npm" ? "npm install" : `${pm} add`);
      if (dev) parts.push("-D");
      if (pkg) parts.push(pkg);
      break;
    case "create":
      parts.push(`${pm} create`);
      if (pkg) parts.push(pkg);
      break;
    case "exec":
      if (pm === "npm") parts.push("npx");
      else if (pm === "bun") parts.push("bun x");
      else parts.push(`${pm} dlx`);
      if (pkg) parts.push(pkg);
      break;
    case "run":
      parts.push(pm === "yarn" ? "yarn" : `${pm} run`);
      if (pkg) parts.push(pkg);
      break;
  }

  if (args) {
    // If it's npm and we are passing args to an exec/run script, we often need '--'
    if (pm === "npm" && (type === "exec" || type === "run")) {
      parts.push("--");
    }
    parts.push(args);
  }

  return parts.join(" ");
}

export function PackageManagers({
  pkg,
  type = "add",
  dev = false,
  args,
  className,
}: PackageManagersProps) {
  return (
    <Tabs defaultValue="npm" className={`my-6 ${className || ""}`}>
      <TabsList>
        {MANAGERS.map((pm) => (
          <TabsTrigger key={pm} value={pm}>
            {pm.toLowerCase()}
          </TabsTrigger>
        ))}
      </TabsList>

      {MANAGERS.map((pm) => {
        const command = generateCommand(pm, type, pkg, dev, args);

        return (
          <TabsContent keepMounted={true} key={pm} value={pm}>
            <Code language="bash">{command}</Code>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
