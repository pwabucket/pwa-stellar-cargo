import createStellarIdenticon from "stellar-identicon-js/index";
import { memo } from "react";

export default memo(function AccountImage({ publicKey, ...props }) {
  return <img {...props} src={createStellarIdenticon(publicKey).toDataURL()} />;
});
