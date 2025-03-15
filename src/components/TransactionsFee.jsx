import { calculateTransactionsFee } from "@/lib/utils";
import { memo } from "react";

import Alert from "./Alert";

export default memo(function TransactionsFee({ count = 1 }) {
  return (
    <Alert variant={"info"}>
      <span className="font-bold">Fee:</span> {calculateTransactionsFee(count)}{" "}
      XLM
    </Alert>
  );
});
