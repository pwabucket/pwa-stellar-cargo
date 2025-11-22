import Alert from "@/components/Alert";
import GoogleBackupPrompt from "@/partials/GoogleBackupPrompt";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import Spinner from "@/components/Spinner";
import useAppContext from "@/hooks/useAppContext";
import usePrompt from "@/hooks/usePrompt";
import { Button, PrimaryButton } from "@/components/Button";
import { FaGoogleDrive } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import GoogleDriveProfile from "./GoogleDriveProfile";

export default function GoogleDrive() {
  const { googleApi, googleDrive } = useAppContext();
  const { authorized, initialized, logout } = googleApi;
  const { show, setShow, value, resolve, prompt } = usePrompt();

  const googleDriveMutation = useMutation({
    mutationKey: ["google-drive", "authorize"],
    mutationFn: () => googleDrive.authorize({ prompt }),
  });

  return (
    <InnerAppLayout className="gap-4" headerTitle="Google Drive">
      {/* Google Backup Prompt */}
      <GoogleBackupPrompt
        backupFile={value}
        open={show}
        onOpenChange={setShow}
        resolve={resolve}
      />

      {/* Info */}
      <Alert variant={"info"}>
        Automatically backup your accounts and contacts to Google Drive. Your
        accounts are encrypted with your PIN code.
      </Alert>

      {/* Google Drive Profile */}
      <GoogleDriveProfile />

      {authorized ? (
        <>
          <Button
            className={cn(
              "flex items-center gap-2 justify-center",
              "bg-red-500 text-white"
            )}
            onClick={() => logout()}
          >
            <FaGoogleDrive /> Disconnect
          </Button>
        </>
      ) : initialized ? (
        <>
          <PrimaryButton
            disabled={googleDriveMutation.isPending}
            className="flex items-center gap-2 justify-center"
            onClick={() => googleDriveMutation.mutateAsync()}
          >
            <FaGoogleDrive /> Authorize
          </PrimaryButton>
        </>
      ) : (
        <Spinner />
      )}
    </InnerAppLayout>
  );
}
