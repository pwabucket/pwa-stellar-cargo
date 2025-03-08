import Header from "@/partials/Header";

export default function AppLayout({
  headerLeftContent,
  headerRightContent,
  children,
}) {
  return (
    <>
      <Header
        leftContent={headerLeftContent}
        rightContent={headerRightContent}
      />
      <div className="container mx-auto p-4">{children}</div>
    </>
  );
}
