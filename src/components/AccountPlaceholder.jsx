export default function AccountPlaceholder() {
  return (
    <div className="flex flex-col justify-center items-center gap-2 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-2xl">
      <div className="w-full flex gap-2 justify-center items-center">
        {/* Image */}
        <div className="size-10 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-700" />

        {/* Name */}
        <div className="rounded-full w-2/12 h-4 bg-neutral-200 dark:bg-neutral-700" />
      </div>
      {/* Value */}
      <div className="rounded-full w-5/12 h-4 bg-neutral-200 dark:bg-neutral-700" />

      {/* Address */}
      <div className="rounded-full w-4/6 h-4 bg-neutral-200 dark:bg-neutral-700" />
    </div>
  );
}
