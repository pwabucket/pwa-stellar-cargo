export default function AccountPlaceholder() {
  return (
    <div className="flex flex-col gap-1 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-2xl">
      <div className="flex gap-2 items-center">
        {/* Image */}
        <div className="size-10 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-700" />

        <div className="grow min-w-0 flex flex-col gap-2">
          {/* Name */}
          <div className="rounded-full w-2/12 h-4 bg-neutral-200 dark:bg-neutral-700" />

          {/* Value */}
          <div className="rounded-full w-5/12 h-5 bg-neutral-200 dark:bg-neutral-700" />

          {/* Address */}
          <div className="rounded-full w-5/6 h-3 bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
    </div>
  );
}
