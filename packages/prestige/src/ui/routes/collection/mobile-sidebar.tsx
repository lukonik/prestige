import { useState } from "react";
import { SidebarType } from "../../../vite/core/content/content.types";
import Sidebar from "../../components/sidebar/sidebar";
import { Menu, X } from "lucide-react";

function SidebarOverlay({ sidebar }: { sidebar: SidebarType }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        className="bottom-4 bg-gray-100 p-3 rounded-full right-4 fixed shadow-lg z-50"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>
      {isOpen && (
        <div className="fixed shadow-xl left-0 overflow-auto top-[calc(var(--spacing-header))] w-full h-[calc(100vh-var(--spacing-header))] bg-surface-container">
          <Sidebar onLinkClick={() => setIsOpen(false)} sidebar={sidebar} />
        </div>
      )}
    </>
  );
}

export default function MobileSidebar({ sidebar }: { sidebar: SidebarType }) {
  return <SidebarOverlay sidebar={sidebar} />;
}
