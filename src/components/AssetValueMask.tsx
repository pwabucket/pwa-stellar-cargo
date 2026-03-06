import Decimal from "decimal.js";
import { memo } from "react";
import { repeatComponent } from "@/lib/utils";
import useAppStore from "@/store/useAppStore";

interface AssetValueMaskProps extends Intl.NumberFormatOptions {
  value: Decimal.Value;
  prefix?: string;
  maskLength?: number;
  forceShow?: boolean;
}

export default memo(function AssetValueMask({
  value,
  prefix = "$",
  maskLength = 5,
  forceShow = false,
  ...options
}: AssetValueMaskProps) {
  const showAssetValue = useAppStore((state) => state.showAssetValue);
  return forceShow || showAssetValue
    ? `${prefix}${Intl.NumberFormat("en-US", options).format(new Decimal(value).toNumber())}`
    : repeatComponent(<>&bull;</>, maskLength);
});
