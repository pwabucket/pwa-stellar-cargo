import { Dialog } from "@/components/Dialog";
import { Outlet } from "react-router";
import Welcome from "@/partials/Welcome";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useOutletContext } from "react-router";

export default function ProtectedRoute() {
  const context = useOutletContext<unknown>();
  const isLoggedIn = useIsLoggedIn();

  return (
    <>
      <Outlet context={context} />
      {!isLoggedIn && (
        <Dialog.Root open>
          <Dialog.Portal open>
            <Dialog.Overlay className="fixed inset-0 bg-neutral-950 text-white overflow-auto z-90">
              <Dialog.Content>
                <Dialog.Title className="sr-only">
                  Welcome to Stellar Cargo
                </Dialog.Title>
                <Dialog.Description className="sr-only">
                  Login or create an account to continue
                </Dialog.Description>
                <Welcome />
              </Dialog.Content>
            </Dialog.Overlay>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </>
  );
}
