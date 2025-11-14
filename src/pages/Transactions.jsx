import { useOutletContext } from "react-router";

export default function Transactions() {
  const { account } = useOutletContext();
  return (
    <>
      <p className="text-center px-5 text-neutral-400">
        You can view the transactions of this account at Stellar Expert
      </p>

      <div className="flex justify-center">
        <a
          target="_blank"
          href={`https://stellar.expert/explorer/public/account/${account.publicKey}`}
          className="text-blue-500 font-bold"
        >
          View Transactions
        </a>
      </div>
    </>
  );
}
