import { useState } from "react";
import { SidebarType } from "../../../../vite/core/content/content.types";
import Sidebar from "../../../components/sidebar/sidebar";
import { Menu, X } from "lucide-react";

function SidebarOverlay({ sidebar }: { sidebar: SidebarType }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen((prev) => !prev)}>{isOpen ? <X /> : <Menu />}</button>
      {isOpen && (
        <div className="fixed left-0 overflow-auto top-[calc(var(--spacing-header)+2rem)] w-full h-[calc(100vh-var(--spacing-header)-2rem)] bg-surface-container">
          <Sidebar onLinkClick={() => setIsOpen(false)} sidebar={sidebar} />
        </div>
      )}
    </>
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
