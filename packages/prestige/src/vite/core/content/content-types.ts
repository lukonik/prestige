import { z } from "zod";

export const ArticleSchema = z.object({
  title: z.string().describe("The title of the article"),
  describe: z.string().optional().describe("The description of the article"),
  lastUpdated: z.union([z.date(), z.boolean()]).optional(),
  layout: z.string().optional().describe("The layout of the article"),
});
// 1. Define the basic Link (The "leaf" node)
const SidebarLinkSchema = z.object({
  type: z.literal("link"), // Discriminated union for easier filtering
  label: z.string(),
  slug: z.string(),
});

export type SidebarLink = z.infer<typeof SidebarLinkSchema>;

export type SidebarGroup = {
  type: "group";
  label: string;
  items: SidebarItem[];
};

export type SidebarItem = SidebarLink | SidebarGroup;

// 2. Define the Group (The recursive node)
// We use z.lazy because a group contains items, and items can be groups.
const SidebarGroupSchema: z.ZodType<SidebarGroup> = z.object({
  type: z.literal("group"),
  label: z.string(),
  items: z.lazy(() => z.array(SidebarItemSchema)),
});

// 3. Define the Union (The "Item" that can be either)
const SidebarItemSchema: z.ZodType<SidebarItem> = z.union([SidebarLinkSchema, SidebarGroupSchema]);

// 4. Final Sidebar Schema (An array of items)
export const SidebarSchema = z.array(SidebarItemSchema);

export type Sidebar = z.infer<typeof SidebarSchema>;
