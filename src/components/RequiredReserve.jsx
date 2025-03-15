import { useOutletContext } from "react-router";

import AccountBelowReserveError from "./AccountBelowReserveError";
import Alert from "./Alert";

export default function RequiredReserve() {
  const { accountReserveBalance, accountIsBelowReserve } = useOutletContext();
  return (
    <>
      <Alert variant={"info"}>
        Required Reserve:{" "}
        <span className="font-bold">{accountReserveBalance} XLM</span>
      </Alert>

      {accountIsBelowReserve ? (
        <AccountBelowReserveError requiredBalance={accountIsBelowReserve} />
      ) : null}
    </>
  );
}
