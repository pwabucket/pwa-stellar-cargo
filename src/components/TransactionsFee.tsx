import type { AccountRouteContext } from "@/types/index.d.ts";
import Alert from "./Alert";
import Decimal from "decimal.js";
import { calculateTransactionsFee } from "@/lib/utils";
import { memo } from "react";
import { useMemo } from "react";
import { useOutletContext } from "react-router";

interface TransactionsFeeProps {
  count?: number;
}

export default memo(function TransactionsFee({
  count = 1,
}: TransactionsFeeProps) {
  const { accountXLM, accountReserveBalance } =
    useOutletContext<AccountRouteContext>();
  const totalFee = useMemo(() => calculateTransactionsFee(count), [count]);
  const XLMBalance = useMemo(
    () => new Decimal(accountXLM ? accountXLM["balance"] : "0"),
    [accountXLM],
  );

  const canPerformTransaction = useMemo(
    () =>
      new Decimal(XLMBalance).gte(
        new Decimal(accountReserveBalance).plus(new Decimal(totalFee)),
      ),
    [XLMBalance, accountReserveBalance, totalFee],
  );

  return (
    <Alert variant={canPerformTransaction ? "success" : "danger"}>
      <span className="font-bold">Fee:</span> {totalFee} XLM
    </Alert>
  );
});
