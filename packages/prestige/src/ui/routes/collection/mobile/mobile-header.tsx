import { SidebarType } from "../../../../vite/core/content/content.types";
import Sidebar from "../../../components/sidebar/sidebar";

function SidebarOverlay({ sidebar }: { sidebar: SidebarType }) {
  return (
    <div className="fixed left-0 overflow-auto top-[calc(var(--spacing-header)+2rem)] w-full h-[calc(100vh-var(--spacing-header)-2rem)] bg-surface-container">
      <Sidebar sidebar={sidebar} />
    </div>
  );
}

export default function MobileHeader({ sidebar }: { sidebar: SidebarType }) {
  return (
    <div className="flex h-8 bg-default-100 w-full sticky top-header">
      <SidebarOverlay sidebar={sidebar} />
      <button>HELLo</button>
    </div>
  );
}
