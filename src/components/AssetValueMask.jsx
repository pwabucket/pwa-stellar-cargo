import useAppStore from "@/store/useAppStore";
import { memo } from "react";
import { repeatComponent } from "@/lib/utils";

export default memo(function AssetValueMask({
  value,
  prefix = "~$",
  maskLength = 5,
  forceShow = false,
  ...options
}) {
  const showAssetValue = useAppStore((state) => state.showAssetValue);
  return forceShow || showAssetValue
    ? `${prefix}${Intl.NumberFormat("en-US", options).format(value)}`
    : repeatComponent(<>&bull;</>, maskLength);
});
