import AppIcon from "@/assets/images/icon.svg";
import { PrimaryButton } from "@/components/Button";

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div
      role="alert"
      className="min-h-dvh max-w-md mx-auto p-4 flex flex-col gap-2 justify-center"
    >
      {/* App Icon */}
      <img src={AppIcon} className="h-24" />

      {/* Title */}
      <h1 className="text-3xl text-center font-light">
        {import.meta.env.VITE_APP_NAME}
      </h1>

      <h1 className="text-4xl text-red-500 text-center font-light">Error</h1>

      <p className="px-5 text-red-500 text-center">
        An unexpected error occurred: {error?.message}
      </p>

      <PrimaryButton onClick={resetErrorBoundary}>Refresh</PrimaryButton>
    </div>
  );
}
