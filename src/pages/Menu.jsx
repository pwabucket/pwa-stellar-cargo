import InnerAppLayout from "@/layouts/InnerAppLayout";
import MenuButton from "@/components/MenuButton";
import useAppStore, { THEMES } from "@/store/useAppStore";
import {
  HiOutlineArrowLeftOnRectangle,
  HiOutlineInformationCircle,
  HiOutlineMoon,
  HiOutlineSun,
} from "react-icons/hi2";
import { Link } from "react-router";
import { TbSunMoon } from "react-icons/tb";

export default function Menu() {
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const logout = useAppStore((state) => state.logout);
  const themeIcon =
    theme === THEMES[0]
      ? TbSunMoon
      : theme === THEMES[1]
      ? HiOutlineSun
      : HiOutlineMoon;

  return (
    <InnerAppLayout>
      <div className="flex flex-col gap-2">
        {/* Theme */}
        <MenuButton
          title={`${theme} Theme`}
          icon={themeIcon}
          onClick={toggleTheme}
          className="capitalize"
        />

        {/* About */}
        <MenuButton
          as={Link}
          to="/about"
          title="About"
          icon={HiOutlineInformationCircle}
        />

        {/* Logout */}
        <MenuButton
          title="Logout"
          icon={HiOutlineArrowLeftOnRectangle}
          onClick={logout}
        />
      </div>

      <div className="flex justify-center p-4">
        <a
          href={import.meta.env.VITE_APP_REPOSITORY}
          target="_blank"
          className="text-blue-500"
        >
          Source Codes
        </a>
      </div>
    </InnerAppLayout>
  );
}
