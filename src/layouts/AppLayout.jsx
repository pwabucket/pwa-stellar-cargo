import Header from "@/partials/Header";
import cn from "@/lib/utils";

export default function AppLayout({
  headerLeftContent,
  headerMiddleContent,
  headerRightContent,
  children,
}) {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header
        leftContent={headerLeftContent}
        middleContent={headerMiddleContent}
        rightContent={headerRightContent}
      />
      <div
        className={cn(
          "grow w-full min-w-0 min-h-0 max-w-md mx-auto p-2 pb-10",
          "flex flex-col"
        )}
      >
        {children}
      </div>
    </div>
  );
}
