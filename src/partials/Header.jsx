import AppIcon from "@/assets/images/icon.svg";
import cn from "@/lib/utils";

export default function Header({ leftContent, rightContent }) {
  return (
    <div className="flex gap-2 px-2 py-1 sticky top-0 bg-white border-b border-neutral-300">
      <div className="shrink-0 size-9">{leftContent}</div>
      <h1
        className={cn(
          "text-center truncate",
          "flex gap-2 items-center justify-center font-bold",
          "grow min-w-0 min-h-0"
        )}
      >
        <img src={AppIcon} className="h-5" /> {import.meta.env.VITE_APP_NAME}
      </h1>
      <div className="shrink-0 size-9">{rightContent}</div>
    </div>
  );
}
