import InnerAppLayout from "@/layouts/InnerAppLayout";

const FEATURES = [
  {
    title: "Multiple Accounts",
    description:
      "Create and manage multiple Stellar accounts from a single app.",
  },
  {
    title: "Chunked Transactions",
    description:
      "Send large batches of payments split into manageable transaction chunks.",
  },
  {
    title: "Split & Merge Tokens",
    description:
      "Distribute or consolidate token balances across accounts with ease.",
  },
  {
    title: "Batch Export & Import",
    description:
      "Export and import account data in bulk for quick setup and migration.",
  },
  {
    title: "Google Drive Backup",
    description: "Securely back up your encrypted wallet data to Google Drive.",
  },
  {
    title: "Non-Custodial",
    description: "Your keys, your coins. Private keys never leave your device.",
  },
];

export default function About() {
  return (
    <InnerAppLayout headerTitle="About" className="gap-6">
      {/* App description */}
      <section className="flex flex-col gap-2">
        <h3 className="font-bold text-lg">{import.meta.env.VITE_APP_NAME}</h3>
        <p className="text-sm text-muted-foreground">
          {import.meta.env.VITE_APP_NAME} is a non-custodial Progressive Web App
          (PWA) for managing multiple Stellar accounts. Built for speed and
          simplicity, it lets you send, receive, and organise Stellar assets
          entirely from your browser — no installation required.
        </p>
      </section>

      {/* Features */}
      <section className="flex flex-col gap-3">
        <h3 className="font-bold text-base">Features</h3>
        <ul className="flex flex-col gap-3">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="flex flex-col gap-0.5">
              <span className="font-semibold text-sm">{feature.title}</span>
              <span className="text-sm text-muted-foreground">
                {feature.description}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section className="flex flex-col gap-2">
        <h3 className="font-bold text-base">How It Works</h3>
        <p className="text-sm text-muted-foreground">
          When sending to multiple recipients, the receiving account sponsors
          the transaction fee for all senders. The sponsoring account must hold
          enough XLM to cover the transaction fees and maintain the required
          Stellar reserve.
        </p>
      </section>

      {/* Network */}
      <section className="flex flex-col gap-2">
        <h3 className="font-bold text-base">Network</h3>
        <p className="text-sm text-muted-foreground">
          {import.meta.env.VITE_APP_NAME} connects to the{" "}
          <strong>Stellar Public Network</strong>. All transactions are
          broadcast directly to the Stellar network and are final once
          confirmed.
        </p>
      </section>

      {/* Version */}
      <section className="flex flex-col gap-1 mt-auto pt-4">
        <p className="text-xs text-muted-foreground text-center">
          {import.meta.env.VITE_APP_NAME} &mdash; v
          {import.meta.env.VITE_APP_VERSION ?? "1.0.0"}
        </p>
      </section>
    </InnerAppLayout>
  );
}
