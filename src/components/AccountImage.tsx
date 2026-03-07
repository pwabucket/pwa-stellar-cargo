import { createAccountImage } from "@/lib/utils";
import { memo } from "react";

interface AccountImageProps extends React.ComponentProps<"img"> {
  publicKey: string;
  size?: number;
}

export default memo(function AccountImage({
  publicKey,
  size = 64,
  ...props
}: AccountImageProps) {
  return <img {...props} src={createAccountImage(publicKey, size)} />;
});
