import { createAccountImage } from "@/lib/utils";
import { memo } from "react";

export default memo(function AccountImage({ publicKey, size = 64, ...props }) {
  return <img {...props} src={createAccountImage(publicKey, size)} />;
});
