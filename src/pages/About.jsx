import InnerAppLayout from "@/layouts/InnerAppLayout";

export default function About() {
  return (
    <InnerAppLayout>
      <p>
        {import.meta.env.VITE_APP_NAME} is a non-custodial Stellar Wallet
        primarily for transferring assets from several accounts into one.
      </p>
    </InnerAppLayout>
  );
}
