import { Tabs } from "radix-ui";
import { TbChartAreaLine } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { memo } from "react";

import ClaimedNetWorth from "./ClaimedNetWorth";
import UnclaimedNetWorth from "./UnclaimedNetWorth";

const NetWorthTabButton = memo(function ({ children, ...props }) {
  return (
    <Tabs.Trigger
      {...props}
      className={cn(
        "text-sm p-1 font-bold",
        "border-b-4 border-transparent data-[state=active]:border-blue-400"
      )}
    >
      {children}
    </Tabs.Trigger>
  );
});

export default memo(function NetWorth() {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-4 rounded-2xl",
        "bg-blue-700 text-white"
      )}
    >
      <h3 className="flex gap-1 items-center">
        <TbChartAreaLine className="size-5 inline" />
        Net Worth
      </h3>

      <Tabs.Root defaultValue="claimed" className="flex flex-col gap-2">
        <Tabs.List className="grid grid-cols-2">
          <NetWorthTabButton value="claimed">Claimed</NetWorthTabButton>
          <NetWorthTabButton value="unclaimed">Unclaimed</NetWorthTabButton>
        </Tabs.List>

        <Tabs.Content value="claimed" className="flex flex-col gap-2">
          <ClaimedNetWorth />
        </Tabs.Content>

        <Tabs.Content value="unclaimed" className="flex flex-col gap-2">
          <UnclaimedNetWorth />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
});
