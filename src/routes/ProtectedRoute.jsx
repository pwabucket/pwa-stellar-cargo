import FullPageSpinner from "@/components/FullPageSpinner";
import useAppStore from "@/store/useAppStore";
import useCheckOrNavigate from "@/hooks/useCheckOrNavigate";
import { Outlet } from "react-router";
import { useOutletContext } from "react-router";

export default function ProtectedRoute({ status = true, to = "/" }) {
  const context = useOutletContext();
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const allowed = status === isLoggedIn;

  useCheckOrNavigate(allowed, to, {
    replace: true,
  });

  return allowed ? <Outlet context={context} /> : <FullPageSpinner />;
}
