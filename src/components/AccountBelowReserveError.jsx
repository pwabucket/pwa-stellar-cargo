import { memo } from "react";
import Alert from "./Alert";

export default memo(function AccountBelowReserve({ requiredBalance }) {
  return (
    <Alert variant={"danger"}>
      Account is below reserve! Transactions are likely to fail. You need a
      minimum of <span className="font-bold">{requiredBalance} XLM</span> +
      transaction fees.
    </Alert>
  );
});
