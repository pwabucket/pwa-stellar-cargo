import Alert from "@/components/Alert";
import GoogleBackupPrompt from "@/partials/GoogleBackupPrompt";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import Spinner from "@/components/Spinner";
import useAppContext from "@/hooks/useAppContext";
import useGoogleAuthStore from "@/store/useGoogleAuthStore";
import useGoogleProfileQuery from "@/hooks/useGoogleProfileQuery";
import usePrompt from "@/hooks/usePrompt";
import { Button, PrimaryButton } from "@/components/Button";
import { FaGoogleDrive } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { useMutation } from "@tanstack/react-query";

export default function GoogleDrive() {
  const { googleApi, googleDrive } = useAppContext();
  const { authorized, initialized, logout } = googleApi;
  const { show, setShow, value, resolve, prompt } = usePrompt();
  const backupFile = useGoogleAuthStore((state) => state.backupFile);

  const googleDriveMutation = useMutation({
    mutationKey: ["google-drive", "authorize"],
    mutationFn: () => googleDrive.authorize({ prompt }),
  });

  const profileQuery = useGoogleProfileQuery();
  const profile = profileQuery.data;

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
        accounts are encrypted with your pin code.
      </Alert>

      {authorized ? (
        <>
          {profile ? (
            <div
              className={cn(
                "p-2 rounded-xl",
                "border border-neutral-800",
                "flex items-center gap-2"
              )}
            >
              <img
                src={profile["picture"]}
                className="size-10 shrink-0 rounded-full"
              />

              <div className="flex flex-col gap-1 grow min-w-0">
                <h3 className="truncate font-bold leading-none">
                  {profile["name"]}
                </h3>
                <p className="text-neutral-500 leading-none">
                  {profile["email"]}
                </p>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "p-2 rounded-xl",
                "border border-neutral-800",
                "flex items-center gap-2"
              )}
            >
              {/* Picture */}
              <div
                className={cn(
                  "size-10 shrink-0 rounded-full",
                  "bg-neutral-950"
                )}
              />

              {/* User Info */}
              <div className="flex flex-col gap-1 grow min-w-0">
                {/* Name */}
                <div className="rounded-full w-5/12 h-3 bg-neutral-950" />

                {/* Email */}
                <div className="rounded-full w-5/6 h-3 bg-neutral-950" />
              </div>
            </div>
          )}
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
