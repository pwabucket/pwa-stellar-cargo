import FullPageSpinner from "@/components/FullPageSpinner";
import { Outlet } from "react-router";
import useAppStore from "@/store/useAppStore";
import useCheckOrNavigate from "@/hooks/useCheckOrNavigate";
import { useOutletContext } from "react-router";

interface ProtectedRouteProps {
  status?: boolean;
  to?: string;
}

export default function ProtectedRoute({
  status = true,
  to = "/",
}: ProtectedRouteProps) {
  const context = useOutletContext<unknown>();
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const allowed = status === isLoggedIn;

  useCheckOrNavigate(allowed, to, {
    replace: true,
  });

  return allowed ? <Outlet context={context} /> : <FullPageSpinner />;
}
