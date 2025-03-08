import AccountList from "@/partials/AccountList";
import AppLayout from "@/layouts/AppLayout";
import useAppStore from "@/store/useAppStore";
import { HeaderButton } from "@/components/HeaderButton";
import { HiOutlineArrowLeftOnRectangle, HiOutlinePlus } from "react-icons/hi2";
import { Link } from "react-router";

export default function Dashboard() {
  const logout = useAppStore((state) => state.logout);
  return (
    <AppLayout
      headerLeftContent={
        <HeaderButton onClick={logout} icon={HiOutlineArrowLeftOnRectangle} />
      }
      headerRightContent={
        <HeaderButton as={Link} to={"/import"} icon={HiOutlinePlus} />
      }
    >
      <AccountList />
    </AppLayout>
  );
}
