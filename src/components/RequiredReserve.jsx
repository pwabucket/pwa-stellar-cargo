import { cn } from "@/lib/utils";

export default function RequiredReserve({ balance }) {
  return (
    <p
      className={cn("p-2 text-center rounded-xl", "text-blue-800 bg-blue-100")}
    >
      Required Reserve: <span className="font-bold">{balance} XLM</span>
    </p>
  );
}
