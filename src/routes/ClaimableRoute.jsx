import { Outlet, useParams } from "react-router";

import useCheckOrNavigate from "@/hooks/useCheckOrNavigate";
import { useMemo } from "react";
import { useOutletContext } from "react-router";

export default function ClaimableRoute() {
  const params = useParams();
  const context = useOutletContext();
  const { pendingClaimable } = context;

  const claimableAsset = useMemo(
    () => pendingClaimable.find((item) => params.assetId === item["asset_id"]),
    [params.assetId, pendingClaimable],
  );

  /** Redirect if not found */
  useCheckOrNavigate(claimableAsset, -1, {
    replace: true,
  });

  return (
    <Outlet
      context={{
        ...context,
        claimableAsset,
      }}
    />
  );
}
