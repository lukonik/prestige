import { Menu, X } from "lucide-react";
import { useState } from "react";
import { SidebarType } from "../../../vite/core/content/content.types";
import Sidebar from "./sidebar";

function SidebarOverlay({ sidebar }: { sidebar: SidebarType }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="lg:hidden">
      {/* Mobile sidebar button is placed on the start of mobile of content tab, we have to position is via fixed because table of content lives inside content.route */}
      <button
        className="bg-transparent p-3 -mt-[2px] text-default-700 top-header left-0 fixed  z-50"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>
      {isOpen && (
        <div className="fixed shadow-xl left-0 overflow-auto top-0 z-10 bg-default-50 w-full h-screen">
          <Sidebar onLinkClick={() => setIsOpen(false)} sidebar={sidebar} />
        </div>
      )}
    </div>
  );
}

export default function MobileSidebar({ sidebar }: { sidebar: SidebarType }) {
  return <SidebarOverlay sidebar={sidebar} />;
}
