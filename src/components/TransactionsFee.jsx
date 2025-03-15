import { calculateTransactionsFee } from "@/lib/utils";
import { memo } from "react";
import { useMemo } from "react";
import { useOutletContext } from "react-router";

import Alert from "./Alert";

export default memo(function TransactionsFee({ count = 1 }) {
  const { accountXLM, accountReserveBalance } = useOutletContext();
  const totalFee = useMemo(() => calculateTransactionsFee(count), [count]);
  const XLMBalance = accountXLM["balance"];

  const canPerformTransaction = useMemo(
    () =>
      parseFloat(XLMBalance) >=
      parseFloat(accountReserveBalance) + parseFloat(totalFee),
    [XLMBalance, accountReserveBalance, totalFee]
  );

  return (
    <Alert variant={canPerformTransaction ? "success" : "danger"}>
      <span className="font-bold">Fee:</span> {totalFee} XLM
    </Alert>
  );
});
