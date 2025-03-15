import { memo } from "react";
import { createAccountImage } from "@/lib/utils";

export default memo(function AccountImage({ publicKey, ...props }) {
  return <img {...props} src={createAccountImage(publicKey)} />;
});
