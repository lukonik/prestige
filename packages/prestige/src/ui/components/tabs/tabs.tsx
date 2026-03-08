import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

function Tabs({
  orientation = "horizontal",
  className,
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={`w-full ${className || ""}`}
      {...props}
    />
  );
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={`flex w-full overflow-x-auto border-b border-default-200 no-scrollbar ${
        className || ""
      }`}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={`
        -mb-px flex items-center justify-center whitespace-nowrap border-b-2 border-transparent 
        px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer
        text-default-600 hover:text-default-900 hover:border-default-300
        aria-selected:border-primary-500 aria-selected:text-primary-500 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        disabled:pointer-events-none disabled:opacity-50
        ${className || ""}
      `}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={`mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
        className || ""
      }`}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
