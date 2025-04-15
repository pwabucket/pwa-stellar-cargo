import FooterLinks from "@/partials/FooterLinks";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import useAppStore, { THEMES } from "@/store/useAppStore";
import { FaGoogleDrive } from "react-icons/fa";
import {
  HiOutlineArrowLeftOnRectangle,
  HiOutlineArrowLongDown,
  HiOutlineArrowLongUp,
  HiOutlineMoon,
  HiOutlineSun,
} from "react-icons/hi2";
import { Link } from "react-router";
import { MenuButton, MenuToggleButton } from "@/components/MenuButton";
import { TbChartAreaLine } from "react-icons/tb";
import { TbSunMoon } from "react-icons/tb";

export default function Menu() {
  const theme = useAppStore((state) => state.theme);
  const showNetWorth = useAppStore((state) => state.showNetWorth);
  const setShowNetWorth = useAppStore((state) => state.setShowNetWorth);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const logout = useAppStore((state) => state.logout);
  const themeIcon =
    theme === THEMES[0]
      ? HiOutlineSun
      : theme === THEMES[1]
      ? HiOutlineMoon
      : TbSunMoon;

  return (
    <InnerAppLayout className="gap-4">
      <div className="flex flex-col gap-2">
        {/* Net Worth */}
        <MenuToggleButton
          title="Net Worth"
          icon={TbChartAreaLine}
          checked={showNetWorth}
          onChange={(ev) => setShowNetWorth(ev.target.checked)}
        />

        {/* Theme */}
        <MenuButton
          title={`${theme} Theme`}
          icon={themeIcon}
          onClick={toggleTheme}
          className="capitalize"
        />
      </div>

      <div className="flex flex-col gap-2">
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

      <div className="flex flex-col gap-2">
        {/* Google Drive */}
        <MenuButton
          as={Link}
          to="/google-drive"
          title="Google Drive Sync"
          icon={FaGoogleDrive}
        />
      </div>

      <div className="flex flex-col gap-2">
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
