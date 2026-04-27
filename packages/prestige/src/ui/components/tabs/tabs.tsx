import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

type TabsOrientation = "horizontal" | "vertical";

interface TabsContextValue {
  baseId: string;
  value: string | undefined;
  orientation: TabsOrientation;
  setValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(componentName: string) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Tabs`);
  }

  return context;
}

type TabsProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "defaultValue" | "onChange"
> & {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: TabsOrientation;
  value?: string;
};

function Tabs({
  orientation = "horizontal",
  className,
  defaultValue,
  onValueChange,
  value: controlledValue,
  ...props
}: TabsProps) {
  const baseId = useId();
  const [uncontrolledValue, setUncontrolledValue] = useState<
    string | undefined
  >(defaultValue);
  const value = controlledValue ?? uncontrolledValue;

  function setValue(nextValue: string) {
    if (controlledValue === undefined) {
      setUncontrolledValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  return (
    <TabsContext.Provider value={{ baseId, orientation, setValue, value }}>
      <div
        data-slot="tabs"
        data-orientation={orientation}
        className={`w-full ${className || ""}`}
        {...props}
      />
    </TabsContext.Provider>
  );
}

type TabsListProps = ComponentPropsWithoutRef<"div">;

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, onKeyDown, ...props },
  ref,
) {
  const { orientation } = useTabsContext("TabsList");

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);

    if (event.defaultPrevented || !(event.target instanceof HTMLElement)) {
      return;
    }

    const keys =
      orientation === "vertical"
        ? ["ArrowUp", "ArrowDown", "Home", "End"]
        : ["ArrowLeft", "ArrowRight", "Home", "End"];

    if (!keys.includes(event.key)) {
      return;
    }

    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not(:disabled)',
      ),
    );
    const currentIndex = tabs.findIndex((tab) => tab === event.target);

    if (currentIndex === -1) {
      return;
    }

    event.preventDefault();

    const lastIndex = tabs.length - 1;
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? lastIndex
          : event.key === "ArrowLeft" || event.key === "ArrowUp"
            ? currentIndex === 0
              ? lastIndex
              : currentIndex - 1
            : currentIndex === lastIndex
              ? 0
              : currentIndex + 1;
    const nextTab = tabs[nextIndex];

    nextTab?.focus();
    nextTab?.click();
  }

  return (
    <div
      ref={ref}
      data-slot="tabs-list"
      role="tablist"
      aria-orientation={orientation}
      className={`flex w-full overflow-x-auto border-b border-default-200 no-scrollbar ${
        className || ""
      }`}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
});

type TabsTriggerProps = Omit<ComponentPropsWithoutRef<"button">, "value"> & {
  value: string;
};

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger(
    { className, disabled, id, onClick, type = "button", value, ...props },
    ref,
  ) {
    const { baseId, setValue, value: selectedValue } =
      useTabsContext("TabsTrigger");
    const isSelected = selectedValue === value;
    const triggerId = `${baseId}-trigger-${value}`;
    const contentId = `${baseId}-content-${value}`;

    function handleClick(event: MouseEvent<HTMLButtonElement>) {
      onClick?.(event);

      if (!event.defaultPrevented && !disabled) {
        setValue(value);
      }
    }

    return (
      <button
        ref={ref}
        id={id ?? triggerId}
        type={type}
        role="tab"
        aria-controls={contentId}
        aria-selected={isSelected}
        data-slot="tabs-trigger"
        data-state={isSelected ? "active" : "inactive"}
        disabled={disabled}
        className={`
          -mb-px flex items-center justify-center whitespace-nowrap border-b-2 border-transparent 
          px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer
          text-default-600 hover:text-default-900 hover:border-default-300
          aria-selected:border-primary-500 aria-selected:text-primary-500 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
          disabled:pointer-events-none disabled:opacity-50
          ${className || ""}
        `}
        onClick={handleClick}
        {...props}
      />
    );
  },
);

type TabsContentProps = ComponentPropsWithoutRef<"div"> & {
  keepMounted?: boolean;
  value: string;
};

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent({ className, keepMounted, value, ...props }, ref) {
    const { baseId, value: selectedValue } = useTabsContext("TabsContent");
    const isSelected = selectedValue === value;

    if (!keepMounted && !isSelected) {
      return null;
    }

    return (
      <div
        ref={ref}
        id={`${baseId}-content-${value}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-trigger-${value}`}
        data-slot="tabs-content"
        data-state={isSelected ? "active" : "inactive"}
        hidden={!isSelected}
        tabIndex={0}
        className={`mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
          className || ""
        }`}
        {...props}
      />
    );
  },
);

export { Tabs, TabsList, TabsTrigger, TabsContent };
