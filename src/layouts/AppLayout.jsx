import Header from "@/partials/Header";
import { cn } from "@/lib/utils";
export default function AppLayout({
  headerLeftContent,
  headerMiddleContent,
  headerRightContent,
  headerTitle,
  className,
  children,
}) {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header
        leftContent={headerLeftContent}
        middleContent={
          headerMiddleContent ||
          (headerTitle ? (
            <h2
              className={cn(
                "text-center truncate",
                "flex gap-2 items-center justify-center font-bold"
              )}
            >
              {headerTitle}
            </h2>
          ) : null)
        }
        rightContent={headerRightContent}
      />
      <div
        className={cn(
          "grow w-full min-w-0 min-h-0 max-w-md mx-auto p-4",
          "flex flex-col",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
