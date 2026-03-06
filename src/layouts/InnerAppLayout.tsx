import AppLayout from "./AppLayout";
import type { ComponentProps } from "react";
import { HeaderReturnButton } from "@/components/HeaderButton";

export default function InnerAppLayout(
  props: ComponentProps<typeof AppLayout>,
) {
  return <AppLayout {...props} headerLeftContent={<HeaderReturnButton />} />;
}
