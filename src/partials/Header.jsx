import AppIcon from "@/assets/images/icon.svg";
import cn from "@/lib/utils";

export default function Header({ leftContent, middleContent, rightContent }) {
  return (
    <div className="shrink-0 sticky top-0 bg-white border-b border-neutral-300">
      <div className="max-w-md mx-auto flex gap-2 px-2 py-1">
        <div className="shrink-0 size-9">{leftContent}</div>
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
        <div className="shrink-0 size-9">{rightContent}</div>
      </div>
    </div>
  );
}
