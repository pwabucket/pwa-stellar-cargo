import AccountList from "@/partials/AccountList";
import AppLayout from "@/layouts/AppLayout";
import { HeaderButton } from "@/components/HeaderButton";
import { HiOutlineBars3BottomLeft, HiOutlinePlus } from "react-icons/hi2";
import { Link, NavLink } from "react-router";
import { cn } from "@/lib/utils";

const DashboardHeaderNavLink = (props) => (
  <NavLink
    {...props}
    className={({ isActive }) =>
      cn("text-center", isActive && "font-bold text-blue-500")
    }
  />
);

export default function Dashboard() {
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
      <div
        className={cn(
          "bg-white dark:bg-black",
          "shrink-0 sticky top-12",
          "z-30"
        )}
      >
        <div className="max-w-md mx-auto grid grid-cols-2 p-2">
          <DashboardHeaderNavLink to="/app">Accounts</DashboardHeaderNavLink>
          <DashboardHeaderNavLink to="/contacts">
            Contacts
          </DashboardHeaderNavLink>
        </div>
      </div>
      <div className="px-4 pb-10">
        <AccountList />
      </div>
    </AppLayout>
  );
}
