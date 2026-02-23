import z from "zod";

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

export const SidebarSchema = z.array(SidebarItemSchema);

export type Sidebar = z.infer<typeof SidebarSchema>;
