import repeatElement from "repeat-element";
import useAppStore from "@/store/useAppStore";
import { memo } from "react";

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
    : repeatElement(<>&bull;</>, maskLength);
});
