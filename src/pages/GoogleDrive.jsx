import Alert from "@/components/Alert";
import GoogleBackupPrompt from "@/partials/GoogleBackupPrompt";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import Spinner from "@/components/Spinner";
import useAppContext from "@/hooks/useAppContext";
import useGoogleAuthStore from "@/store/useGoogleAuthStore";
import usePrompt from "@/hooks/usePrompt";
import { Button, PrimaryButton } from "@/components/Button";
import { FaGoogleDrive } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";

export default function GoogleDrive() {
  const { googleApi, googleDrive } = useAppContext();
  const { show, setShow, value, resolve, prompt } = usePrompt();
  const backupFile = useGoogleAuthStore((state) => state.backupFile);

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
        <>
          {backupFile ? (
            <Alert variant={"success"} className="text-sm">
              <span className="font-bold">Last Backup:</span>{" "}
              {formatDate(
                new Date(backupFile?.modifiedTime || null),
                "PPPPpppp"
              )}
            </Alert>
          ) : null}
          <Button
            className={cn(
              "flex items-center gap-2 justify-center",
              "bg-red-500 text-white"
            )}
            onClick={() => googleApi.logout()}
          >
            <FaGoogleDrive /> Disconnect
          </Button>
        </>
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
