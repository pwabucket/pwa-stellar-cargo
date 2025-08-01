import AppIcon from "@/assets/images/icon.svg";
import { cn } from "@/lib/utils";

export default function Header({ leftContent, middleContent, rightContent }) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-neutral-900",
        "shrink-0 sticky top-0 border-b",
        "border-neutral-300 dark:border-neutral-700",
        "h-12",
        "z-30"
      )}
    >
      <div className="max-w-md mx-auto h-full flex items-center gap-2 px-1">
        <div className="shrink-0 size-10">{leftContent}</div>
        <div className="grow min-w-0 min-h-0 flex flex-col justify-center">
          {middleContent || (
            <h1
              className={cn(
                "text-center truncate",
                "flex gap-2 items-center justify-center font-bold"
              )}
            >
              <img src={AppIcon} className="h-5" />{" "}
              {import.meta.env.VITE_APP_NAME}
            </h1>
          )}
        </div>
        <div className="shrink-0 size-10">{rightContent}</div>
      </div>
    </div>
  );
}
