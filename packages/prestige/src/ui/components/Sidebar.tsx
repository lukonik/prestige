import sidebar from "virtual:sidebar";
import type {
  SidebarItem,
  SidebarLink as TSidebarLink,
  SidebarGroup as TSidebarGroup,
} from "../../vite/core/content/content-sidebar-types";

function SidebarLink({ item }: { item: TSidebarLink }) {
  return (
    <li>
      <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
        {item.label}
      </a>
    </li>
  );
}

function SidebarGroup({ item }: { item: TSidebarGroup }) {
  if (item.collapsible) {
    return (
      <details className="group" open>
        <summary className="cursor-pointer px-4 py-2 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
          {item.label}
        </summary>
        <ul className="pl-4 mt-1 space-y-1">
          {item.items.map((subItem, index) => (
            <SidebarItemNode key={index} item={subItem} />
          ))}
        </ul>
      </details>
    );
  }

  return (
    <div className="mb-4">
      <div className="px-4 py-2 font-semibold">{item.label}</div>
      <ul className="pl-4 space-y-1">
        {item.items.map((subItem, index) => (
          <SidebarItemNode key={index} item={subItem} />
        ))}
      </ul>
    </div>
  );
}

function SidebarItemNode({ item }: { item: SidebarItem }) {
  if ("items" in item) {
    return <SidebarGroup item={item} />;
  }
  return <SidebarLink item={item} />;
}

export default function Sidebar() {
  return (
    <aside className="w-64 h-full overflow-y-auto border-r border-gray-200 dark:border-gray-800">
      <nav className="p-4">
        <h1>wqeqw</h1>
        <ul className="space-y-1">
          {sidebar.map((item, index) => (
            <SidebarItemNode key={index} item={item} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
