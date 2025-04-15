/* eslint-disable no-undef */
import GoogleBackupPrompt from "@/partials/GoogleBackupPrompt";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import Spinner from "@/components/Spinner";
import useAppContext from "@/hooks/useAppContext";
import usePrompt from "@/hooks/usePrompt";
import { Button, PrimaryButton } from "@/components/Button";
import { FaGoogleDrive } from "react-icons/fa";
import { cn } from "@/lib/utils";

export default function GoogleDrive() {
  const { googleApi, googleDrive } = useAppContext();
  const { show, setShow, value, resolve, prompt } = usePrompt();

  const authorizeGoogleDrive = () => googleDrive.authorize({ prompt });

  return (
    <InnerAppLayout className="gap-4" headerTitle="Google Drive">
      {/* Google Backup Prompt */}
      <GoogleBackupPrompt
        backupFile={value}
        open={show}
        onOpenChange={setShow}
        resolve={resolve}
      />

      {googleApi.authorized ? (
        <Button
          className={cn(
            "flex items-center gap-2 justify-center",
            "bg-red-500 text-white"
          )}
          onClick={() => googleApi.logout()}
        >
          <FaGoogleDrive /> Disconnect
        </Button>
      ) : googleApi.initialized ? (
        <PrimaryButton
          className="flex items-center gap-2 justify-center"
          onClick={authorizeGoogleDrive}
        >
          <FaGoogleDrive /> Authorize
        </PrimaryButton>
      ) : (
        <Spinner />
      )}
    </InnerAppLayout>
  );
}
