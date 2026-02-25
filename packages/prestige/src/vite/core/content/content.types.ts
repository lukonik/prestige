import { z } from "zod";

export const ContentSchema = z.object({
  title: z.string().describe("The title of the article"),
  describe: z.string().optional().describe("The description of the article"),
  lastUpdated: z.union([z.date(), z.boolean()]).optional(),
  label: z.string().optional().describe("The label of the content"),
});

const CollectionLinkSchema = z.union([
  z.object({
    label: z.string(),
    slug: z.string(),
  }),
  z.string(),
]);

const CollectionGroupSchema: z.ZodType<CollectionGroup> = z.object({
  label: z.string(),
  items: z.lazy(() => z.array(CollectionItemSchema)).optional(),
  collapsible: z.boolean().optional(),
  autogenerate: z.object({
    directory: z.string(),
  }).optional(),
});

export type CollectionLink = z.infer<typeof CollectionLinkSchema>;

export type CollectionGroup = {
  label: string;
  items?: CollectionItem[];
  collapsible?: boolean | undefined;
  autogenerate?: { directory: string };
};

export type CollectionItem = CollectionLink | CollectionGroup;

const CollectionItemSchema: z.ZodType<CollectionItem> = z.union([
  CollectionLinkSchema,
  z.lazy(() => CollectionGroupSchema),
]);

export const CollectionSchema = z.object({
  id: z
    .string()
    .min(1, { message: "Folder name cannot be empty" })
    .max(50, { message: "Folder name too long" })
    // Allows alphanumeric, hyphens, and underscores
    .regex(/^[a-zA-Z0-9-_]+$/, {
      message: "Only alphanumeric, hyphens, and underscores allowed",
    })
    .describe("The id of the collection, must match the folder name"),
  items: z.array(CollectionItemSchema),
});

export type Collection = z.infer<typeof CollectionSchema>;

export type CollectionInput = z.input<typeof CollectionSchema>;

export const CollectionsSchema = z.array(CollectionSchema);

export type Collections = z.infer<typeof CollectionsSchema>;

export interface SidebarLink {
  slug: string;
  label: string;
}

export interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

export type SidebarItem = SidebarLink | SidebarGroup;

export interface Sidebar {
  items: SidebarItem[];
}
