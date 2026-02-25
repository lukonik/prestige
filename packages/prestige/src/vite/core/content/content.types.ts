import { z } from "zod";

export const ContentSchema = z.object({
  title: z.string().describe("The title of the article"),
  describe: z.string().optional().describe("The description of the article"),
  lastUpdated: z.union([z.date(), z.boolean()]).optional(),
});

const SidebarLinkSchema = z.object({
  label: z.string(),
  slug: z.string(),
});

export type SidebarLink = z.infer<typeof SidebarLinkSchema>;

export type SidebarGroup = {
  label: string;
  items: SidebarItem[];
  collapsible?: boolean | undefined;
};

export type SidebarItem = SidebarLink | SidebarGroup;

const SidebarItemSchema: z.ZodType<SidebarItem> = z.union([
  SidebarLinkSchema,
  z.lazy(() => SidebarGroupSchema),
]);

const SidebarGroupSchema: z.ZodType<SidebarGroup> = z.object({
  label: z.string(),
  items: z.lazy(() => z.array(SidebarItemSchema)),
  collapsible: z.boolean().optional(),
});

export const SidebarSchema = z.object({
  id: z
    .string()
    .min(1, { message: "Folder name cannot be empty" })
    .max(50, { message: "Folder name too long" })
    // Allows alphanumeric, hyphens, and underscores
    .regex(/^[a-zA-Z0-9-_]+$/, {
      message: "Only alphanumeric, hyphens, and underscores allowed",
    })
    .describe("The id of the sidebar, must match the folder name"),
  items: z.array(SidebarItemSchema),
});

export type Sidebar = z.infer<typeof SidebarSchema>;

export type SidebarInput = z.input<typeof SidebarSchema>;

export const SidebarsSchema = z.array(SidebarSchema);

export type Sidebars = z.infer<typeof SidebarsSchema>;
