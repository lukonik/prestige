import { z } from "zod";

export const ContentHeadFrontmatterSchema = z.array(
  z.object({
    tag: z.string(),
    attrs: z
      .record(z.string(), z.union([z.string(), z.boolean()]).optional())
      .optional(),
    content: z.string().optional(),
  }),
);

export type ContentHeadFrontmatterType = z.infer<
  typeof ContentHeadFrontmatterSchema
>;

export const ContentFrontmatterSchema = z.object({
  title: z.string().describe("The title of the article"),
  description: z.string().optional().describe("The description of the article"),
  label: z.string().optional().describe("The label of the content"),
  head: ContentHeadFrontmatterSchema,
});

export type ContentFrontmatterType = z.infer<typeof ContentFrontmatterSchema>;

export const ContentSchema = z.object({
  matter: ContentFrontmatterSchema,
  html: z.string().describe("The html of the content"),
});

export type ContentType = z.infer<typeof ContentSchema>;

const InternalCollectionLinkSchema = z.union([
  z.object({
    label: z.string(),
    slug: z.string(),
  }),
  z.string(),
]);

const ExternalCollectionLinkSchema = z.object({
  label: z.string(),
  link: z.string(),
});

export type ExternalCollectionLink = z.infer<
  typeof ExternalCollectionLinkSchema
>;

export type InternalCollectionLink = z.infer<
  typeof InternalCollectionLinkSchema
>;

export type CollectionGroup = {
  label: string;
  items?: CollectionItem[] | undefined;
  collapsed?: boolean | undefined;
  autogenerate?: { directory: string } | undefined;
};

export type CollectionItem =
  | InternalCollectionLink
  | CollectionGroup
  | ExternalCollectionLink;

const CollectionGroupSchema: z.ZodType<CollectionGroup, CollectionGroup> =
  z.object({
    label: z.string(),
    items: z.lazy(() => z.array(CollectionItemSchema)).optional(),
    collapsed: z.boolean().optional(),
    autogenerate: z
      .object({
        directory: z.string(),
      })
      .optional(),
  });

const CollectionItemSchema: z.ZodType<CollectionItem, CollectionItem> = z.union(
  [
    ExternalCollectionLinkSchema,
    InternalCollectionLinkSchema,
    z.lazy(() => CollectionGroupSchema),
  ],
);

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
  defaultLink: z
    .string()
    .optional()
    .describe("The default link of the collection"),
});

export type Collection = z.infer<typeof CollectionSchema>;

export type CollectionNavigation = {
  id: string;
  label: string;
  defaultLink?: string;
};

export type CollectionInput = z.input<typeof CollectionSchema>;

export const CollectionsSchema = z.array(CollectionSchema);

export type Collections = z.infer<typeof CollectionsSchema>;

export interface InternalSidebarLinkType {
  slug: string;
  label: string;
}

export interface ExternalSidebarLinkType {
  label: string;
  link: string;
}

export type SidebarLinkType = InternalSidebarLinkType | ExternalSidebarLinkType;

export interface SidebarGroupType {
  label: string;
  items: SidebarItemType[];
  collapsed?: boolean | undefined;
}

export type SidebarItemType =
  | InternalSidebarLinkType
  | SidebarGroupType
  | ExternalSidebarLinkType;

export interface SidebarType {
  items: SidebarItemType[];
  defaultLink: string;
  navigation: Record<string, NavigationLinks>;
}

export interface SiblingNavigationType {
  label: string;
  link: string;
}

export interface NavigationLinks {
  prev: SiblingNavigationType | null | undefined;
  next: SiblingNavigationType | null | undefined;
}
