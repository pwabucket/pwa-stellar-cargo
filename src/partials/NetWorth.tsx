import { HiOutlineClock, HiOutlineWallet } from "react-icons/hi2";

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
        "relative z-10 flex items-center justify-center gap-1.5",
        "text-sm py-1.5 px-3 font-bold rounded-full",
        "transition-all duration-300",
        "text-black/60 data-[state=active]:text-black",
        "data-[state=active]:bg-white/40 data-[state=active]:shadow-sm",
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
        "flex flex-col gap-3 p-4 rounded-2xl",
        "bg-blue-400 text-black",
      )}
    >
      <h3 className="flex gap-1.5 items-center font-bold text-sm tracking-wide uppercase text-black/80">
        <TbChartAreaLine className="size-5" />
        Net Worth
      </h3>

      <Tabs.Root defaultValue="balance" className="flex flex-col gap-3">
        <Tabs.List className="grid grid-cols-2 bg-black/10 rounded-full p-1">
          <NetWorthTabButton value="balance">
            <HiOutlineWallet className="size-4" />
            Balance
          </NetWorthTabButton>
          <NetWorthTabButton value="claimable">
            <HiOutlineClock className="size-4" />
            Claimable
          </NetWorthTabButton>
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
