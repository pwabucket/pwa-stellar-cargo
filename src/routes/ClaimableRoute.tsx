import { Outlet, useParams } from "react-router";

import type { AccountRouteContext } from "@/types/index.d.ts";
import Spinner from "@/components/Spinner";
import useCheckOrNavigate from "@/hooks/useCheckOrNavigate";
import { useMemo } from "react";
import { useOutletContext } from "react-router";

export default function ClaimableRoute() {
  const params = useParams<{ assetId: string }>();
  const context = useOutletContext<AccountRouteContext>();
  const { pendingClaimable } = context;

  const claimableAsset = useMemo(
    () => pendingClaimable.find((item) => params.assetId === item["asset_id"]),
    [params.assetId, pendingClaimable],
  );

  /** Redirect if not found */
  useCheckOrNavigate(claimableAsset, -1, {
    replace: true,
  });

  return claimableAsset ? (
    <Outlet
      context={{
        ...context,
        claimableAsset,
      }}
    />
  ) : (
    <Spinner />
  );
}
