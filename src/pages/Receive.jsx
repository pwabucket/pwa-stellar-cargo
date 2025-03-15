import { IoCopyOutline } from "react-icons/io5";
import { PrimaryButton } from "@/components/Button";
import { QRCodeSVG } from "qrcode.react";
import { copyToClipboard, createAccountImage } from "@/lib/utils";
import { memo } from "react";
import { useMemo } from "react";
import { useOutletContext } from "react-router";

export default memo(function Receive() {
  const { account } = useOutletContext();
  const src = useMemo(
    () => createAccountImage(account.publicKey),
    [account.publicKey]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* QR Code */}
      <div className="flex">
        <QRCodeSVG
          value={account.publicKey}
          title={"Send"}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"M"}
          size={200}
          imageSettings={{
            src,
            x: undefined,
            y: undefined,
            height: 24,
            width: 24,
            opacity: 1,
            excavate: true,
          }}
          style={{
            width: "100%",
          }}
        />
      </div>

      <p className="break-words text-center px-4 font-bold">
        {account.publicKey}
      </p>
      <PrimaryButton onClick={() => copyToClipboard(account.publicKey)}>
        <IoCopyOutline className="size-4 inline-flex" /> Copy
      </PrimaryButton>
    </div>
  );
});
