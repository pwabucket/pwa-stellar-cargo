import Alert from "@/components/Alert";
import useGoogleAuthStore from "@/store/useGoogleAuthStore";
import useGoogleProfileQuery from "@/hooks/useGoogleProfileQuery";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";

export default function GoogleDriveProfile() {
  const token = useGoogleAuthStore((state) => state.token);
  const backupFile = useGoogleAuthStore((state) => state.backupFile);

  const profileQuery = useGoogleProfileQuery();
  const profile = profileQuery.data;

  return token ? (
    <>
      {profile ? (
        <div
          className={cn(
            "p-2 rounded-xl",
            "border border-slate-600",
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
            <p className="text-slate-500 leading-none">{profile["email"]}</p>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "p-2 rounded-xl",
            "border border-slate-600",
            "flex items-center gap-2"
          )}
        >
          {/* Picture */}
          <div
            className={cn("size-10 shrink-0 rounded-full", "bg-slate-700")}
          />

          {/* User Info */}
          <div className="flex flex-col gap-1 grow min-w-0">
            {/* Name */}
            <div className="rounded-full w-5/12 h-3 bg-slate-700" />

            {/* Email */}
            <div className="rounded-full w-5/6 h-3 bg-slate-700" />
          </div>
        </div>
      )}
      {backupFile ? (
        <Alert variant={"success"} className="text-sm">
          <span className="font-bold">Last Backup:</span>{" "}
          {formatDate(new Date(backupFile?.modifiedTime || null), "PPPPpppp")}
        </Alert>
      ) : null}
    </>
  ) : null;
}
