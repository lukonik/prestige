declare module "virtual:sidebar" {
  type SidebarLink = {
    label: string;
    slug: string;
  };
  type SidebarGroup = {
    label: string;
    items: SidebarItem[];
    collapsible?: boolean | undefined;
  };

  type SidebarItem = SidebarLink | SidebarGroup;

  type Sidebar = SidebarItem[];

  const data: Sidebar;
  export default data;
}
