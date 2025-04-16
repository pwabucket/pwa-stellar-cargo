import InnerAppLayout from "@/layouts/InnerAppLayout";

export default function About() {
  return (
    <InnerAppLayout>
      <p>
        {import.meta.env.VITE_APP_NAME} is a non-custodial Stellar Wallet for
        managing multiple accounts.
      </p>
    </InnerAppLayout>
  );
}
