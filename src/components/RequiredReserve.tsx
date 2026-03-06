import AccountBelowReserveError from "./AccountBelowReserveError";
import type { AccountRouteContext } from "@/types/index.d.ts";
import Alert from "./Alert";
import Decimal from "decimal.js";
import { useOutletContext } from "react-router";

export default function RequiredReserve() {
  const { accountReserveBalance, accountIsBelowReserve } =
    useOutletContext<AccountRouteContext>();
  return (
    <>
      <Alert variant={"info"}>
        Required Reserve:{" "}
        <span className="font-bold">
          {accountReserveBalance.toFixed(7, Decimal.ROUND_DOWN)} XLM
        </span>
      </Alert>

      {accountIsBelowReserve ? (
        <AccountBelowReserveError requiredBalance={accountReserveBalance} />
      ) : null}
    </>
  );
}
