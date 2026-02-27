import { z } from "zod";

export const ContentSchema = z.object({
  metadata: z.object({
    title: z.string().optional().describe("The title of the article"),
    describe: z.string().optional().describe("The description of the article"),
    lastUpdated: z.union([z.date(), z.boolean()]).optional(),
    label: z.string().optional().describe("The label of the content"),
  }),
  html: z.string().describe("The html of the content"),
});

export type ContentType = z.infer<typeof ContentSchema>;

const CollectionLinkSchema = z.union([
  z.object({
    label: z.string(),
    slug: z.string(),
  }),
  z.string(),
]);

export type CollectionLink = z.infer<typeof CollectionLinkSchema>;

export type CollectionGroup = {
  label: string;
  items?: CollectionItem[] | undefined;
  collapsible?: boolean | undefined;
  autogenerate?: { directory: string } | undefined;
};

export type CollectionItem = CollectionLink | CollectionGroup;

const CollectionGroupSchema: z.ZodType<CollectionGroup> = z.object({
  label: z.string(),
  items: z.lazy(() => z.array(CollectionItemSchema)).optional(),
  collapsible: z.boolean().optional(),
  autogenerate: z
    .object({
      directory: z.string(),
    })
    .optional(),
});

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
  label: z.string().optional().describe("The label of the collection"),
});

export type Collection = z.infer<typeof CollectionSchema>;

export type CollectionNavigation = {
  id: string;
  label: string;
};

export type CollectionInput = z.input<typeof CollectionSchema>;

export const CollectionsSchema = z.array(CollectionSchema);

export type Collections = z.infer<typeof CollectionsSchema>;

export interface SidebarLinkType {
  slug: string;
  label: string;
}

export interface SidebarGroupType {
  label: string;
  items: SidebarItemType[];
  collapsible?: boolean | undefined;
}

export type SidebarItemType = SidebarLinkType | SidebarGroupType;

export interface SidebarType {
  items: SidebarItemType[];
}
