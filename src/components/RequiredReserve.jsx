import AccountBelowReserveError from "./AccountBelowReserveError";
import Alert from "./Alert";

export default function RequiredReserve({ isBelowReserve, requiredBalance }) {
  return (
    <>
      <Alert variant={"info"}>
        Required Reserve:{" "}
        <span className="font-bold">{requiredBalance} XLM</span>
      </Alert>

      {isBelowReserve ? (
        <AccountBelowReserveError requiredBalance={requiredBalance} />
      ) : null}
    </>
  );
}
