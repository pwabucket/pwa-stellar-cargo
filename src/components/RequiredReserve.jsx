import { useOutletContext } from "react-router";

import AccountBelowReserveError from "./AccountBelowReserveError";
import Alert from "./Alert";
import Decimal from "decimal.js";

export default function RequiredReserve() {
  const { accountReserveBalance, accountIsBelowReserve } = useOutletContext();
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
