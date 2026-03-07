import type { AssetsMetaMap } from "@/types/index.d.ts";
import DefaultAssetIcon from "@/assets/images/asset.png?format=webp&w=80";
import useAssetMetaQuery from "./useAssetMetaQuery";
import useIsLoggedIn from "./useIsLoggedIn";
import { useMemo } from "react";

export default function useAssetsMeta(assetIds: string[]): AssetsMetaMap {
  const isLoggedIn = useIsLoggedIn();
  const ids = useMemo(() => assetIds.slice().sort(), [assetIds]);
  const assetMetaQuery = useAssetMetaQuery(ids, {
    enabled: isLoggedIn && ids.length > 0,
  });

  return useMemo(
    () =>
      assetMetaQuery.data
        ? Object.fromEntries(
            assetMetaQuery.data.map((item) => [
              item["asset"].split("-").slice(0, 2).join("-"),
              {
                ...item,
                ["icon"]: item["toml_info"]?.["image"] || DefaultAssetIcon,
              },
            ]),
          )
        : {},
    [assetMetaQuery.data],
  );
}
