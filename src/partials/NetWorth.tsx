import BalanceNetWorth from "./BalanceNetWorth";
import ClaimableNetWorth from "./ClaimableNetWorth";
import { Tabs } from "radix-ui";
import { TbChartAreaLine } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { memo } from "react";

const NetWorthTabButton = memo(function NetWorthTabButton({
  children,
  ...props
}: Tabs.TabsTriggerProps) {
  return (
    <Tabs.Trigger
      {...props}
      className={cn(
        "text-sm p-1 font-bold rounded-t-xl",
        "border-b-4 border-transparent data-[state=active]:border-blue-500",
        "data-[state=active]:bg-blue-300/70",
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
        "bg-blue-400 text-black",
      )}
    >
      <h3 className="flex gap-1 items-center">
        <TbChartAreaLine className="size-5 inline" />
        Net Worth
      </h3>

      <Tabs.Root defaultValue="balance" className="flex flex-col gap-2">
        <Tabs.List className="grid grid-cols-2">
          <NetWorthTabButton value="balance">Balance</NetWorthTabButton>
          <NetWorthTabButton value="claimable">Claimable</NetWorthTabButton>
        </Tabs.List>

        <Tabs.Content value="balance" className="flex flex-col gap-2">
          <BalanceNetWorth />
        </Tabs.Content>

        <Tabs.Content value="claimable" className="flex flex-col gap-2">
          <ClaimableNetWorth />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
});
