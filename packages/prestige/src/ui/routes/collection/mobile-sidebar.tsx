import { Menu, X } from "lucide-react";
import { useState } from "react";
import { SidebarType } from "../../../vite/core/content/content.types";
import Sidebar from "./sidebar";

function SidebarOverlay({ sidebar }: { sidebar: SidebarType }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button
        className="bottom-4 bg-default-100 p-3 rounded-full right-4 fixed shadow-lg z-50"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>
      {isOpen && (
        <div className="fixed shadow-xl left-0 overflow-auto top-[calc(var(--spacing-header))] bg-white w-full h-[calc(100vh-var(--spacing-header))]">
          <Sidebar onLinkClick={() => setIsOpen(false)} sidebar={sidebar} />
        </div>
      )}
    </div>
  );
}

export default function MobileSidebar({ sidebar }: { sidebar: SidebarType }) {
  return <SidebarOverlay sidebar={sidebar} />;
}
