import { HiOutlineBars3BottomLeft, HiOutlinePlus } from "react-icons/hi2";
import { Link, NavLink, type NavLinkProps } from "react-router";

import AccountList from "@/partials/AccountList";
import AppLayout from "@/layouts/AppLayout";
import { HeaderButton } from "@/components/HeaderButton";
import NetWorth from "@/partials/NetWorth";
import { cn } from "@/lib/utils";
import useAppStore from "@/store/useAppStore";

const DashboardHeaderNavLink = (props: NavLinkProps) => (
  <NavLink
    {...props}
    className={({ isActive }) =>
      cn("text-center p-2.5", isActive && "font-bold text-blue-300")
    }
  />
);

export default function Dashboard() {
  const showNetWorth = useAppStore((state) => state.showNetWorth);

  return (
    <AppLayout
      headerLeftContent={
        <HeaderButton as={Link} to={"/menu"} icon={HiOutlineBars3BottomLeft} />
      }
      headerRightContent={
        <HeaderButton as={Link} to={"/import"} icon={HiOutlinePlus} />
      }
      className={"p-0"}
    >
      <div className={cn("bg-neutral-950", "shrink-0 sticky top-12", "z-30")}>
        <div className="max-w-md mx-auto grid grid-cols-2">
          <DashboardHeaderNavLink to="/">Accounts</DashboardHeaderNavLink>
          <DashboardHeaderNavLink to="/contacts">
            Contacts
          </DashboardHeaderNavLink>
        </div>
      </div>

      <div className="px-4 pb-10 flex flex-col gap-2">
        {/* Net Worth */}
        {showNetWorth ? <NetWorth /> : null}

        {/* Accounts */}
        <AccountList />
      </div>
    </AppLayout>
  );
}
