import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

const TabsRoot = (props: TabsPrimitive.TabsProps) => (
  <TabsPrimitive.Root {...props} />
);

const TabsList = (props: TabsPrimitive.TabsListProps) => (
  <TabsPrimitive.List
    {...props}
    className={cn(
      "grid grid-cols-2 bg-neutral-900 rounded-full p-1",
      props.className,
    )}
  />
);

const TabsTrigger = (props: TabsPrimitive.TabsTriggerProps) => (
  <TabsPrimitive.Trigger
    {...props}
    className={cn(
      "py-1.5 px-3 rounded-full",
      "text-sm font-bold capitalize",
      "transition-all duration-300",
      "text-neutral-400 data-[state=active]:text-blue-300",
      "data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm",
      props.className,
    )}
  />
);

const Tabs = Object.assign(TabsRoot, {
  ...TabsPrimitive,
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
});

export { Tabs };
export type { TabsPrimitive };
