import AccountList from "@/partials/AccountList";
import AppLayout from "@/layouts/AppLayout";
import { HeaderButton } from "@/components/HeaderButton";
import { HiOutlineBars3BottomLeft, HiOutlinePlus } from "react-icons/hi2";
import { Link } from "react-router";

export default function Dashboard() {
  return (
    <AppLayout
      headerLeftContent={
        <HeaderButton as={Link} to={"/menu"} icon={HiOutlineBars3BottomLeft} />
      }
      headerRightContent={
        <HeaderButton as={Link} to={"/import"} icon={HiOutlinePlus} />
      }
    >
      <AccountList />
    </AppLayout>
  );
}
