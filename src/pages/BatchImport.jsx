import InnerAppLayout from "@/layouts/InnerAppLayout";
import useAppStore from "@/store/useAppStore";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/Button";
import { importAllKeys, removeAllKeys } from "@/lib/stellar/keyManager";
import { useState } from "react";

export default function BatchImport() {
  const pinCode = useAppStore((state) => state.pinCode);
  const setAccounts = useAppStore((state) => state.setAccounts);
  const logout = useAppStore((state) => state.logout);
  const [file, setFile] = useState(null);

  const importAll = async () => {
    if (!file) return;

    const reader = new FileReader();

    reader.addEventListener("load", async (ev) => {
      /** Parse JSON */
      const data = JSON.parse(ev.target.result);

      /** Remove all keys */
      await removeAllKeys();

      /** Add Keys */
      await importAllKeys(data.keys, pinCode);

      /** Update Accounts */
      setAccounts(data.accounts);

      /** Logout */
      logout();
    });

    /** Read File */
    reader.readAsText(file);
  };
  return (
    <InnerAppLayout className="gap-2">
      <p className="text-center p-2 rounded-xl bg-yellow-100 text-yellow-800">
        All accounts will be replaced with imported ones
      </p>

      <Input type="file" onChange={(ev) => setFile(ev.target.files[0])} />
      <PrimaryButton onClick={importAll}>Import All</PrimaryButton>
    </InnerAppLayout>
  );
}
