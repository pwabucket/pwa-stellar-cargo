import { memo } from "react";
import Alert from "./Alert";
import Decimal from "decimal.js";

export default memo(function AccountBelowReserve({ requiredBalance }) {
  return (
    <Alert variant={"danger"}>
      Account is below reserve! Transactions are likely to fail. You need a
      minimum of{" "}
      <span className="font-bold">
        {requiredBalance.toFixed(7, Decimal.ROUND_DOWN)} XLM
      </span>{" "}
      + transaction fees.
    </Alert>
  );
});
