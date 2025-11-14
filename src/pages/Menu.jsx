import FooterLinks from "@/partials/FooterLinks";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import useAppStore from "@/store/useAppStore";
import { FaGoogleDrive } from "react-icons/fa";
import {
  HiOutlineArrowLeftOnRectangle,
  HiOutlineArrowLongDown,
  HiOutlineArrowLongUp,
  HiOutlineKey,
} from "react-icons/hi2";
import { Link } from "react-router";
import { MenuButton, MenuToggleButton } from "@/components/MenuButton";
import { TbChartAreaLine } from "react-icons/tb";

export default function Menu() {
  const showNetWorth = useAppStore((state) => state.showNetWorth);
  const setShowNetWorth = useAppStore((state) => state.setShowNetWorth);
  const logout = useAppStore((state) => state.logout);

  return (
    <InnerAppLayout className="gap-4">
      <div className="flex flex-col divide-y divide-neutral-900">
        {/* Net Worth */}
        <MenuToggleButton
          title="Net Worth"
          icon={TbChartAreaLine}
          checked={showNetWorth}
          onChange={(ev) => setShowNetWorth(ev.target.checked)}
        />

        {/* Google Drive */}
        <MenuButton
          as={Link}
          to="/google-drive"
          title="Google Drive Sync"
          icon={FaGoogleDrive}
        />
      </div>

      <div className="flex flex-col divide-y divide-neutral-900">
        {/* Batch Import */}
        <MenuButton
          as={Link}
          to="/batch-import"
          title="Batch Import"
          icon={HiOutlineArrowLongDown}
        />

        {/* Batch Export */}
        <MenuButton
          as={Link}
          to="/batch-export"
          title="Batch Export"
          icon={HiOutlineArrowLongUp}
        />
      </div>

      <div className="flex flex-col divide-y divide-neutral-900">
        {/* PIN Code */}
        <MenuButton
          as={Link}
          to="/pin-code"
          title="PIN Code"
          icon={HiOutlineKey}
        />

        {/* Logout */}
        <MenuButton
          title="Logout"
          icon={HiOutlineArrowLeftOnRectangle}
          onClick={logout}
        />
      </div>

      <FooterLinks />
    </InnerAppLayout>
  );
}
