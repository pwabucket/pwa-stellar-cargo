import InnerAppLayout from "@/layouts/InnerAppLayout";
import MarkdownRender from "@/components/MarkdownRenderer";
import termsOfService from "@/../terms-of-service.md?raw";

export default function TermsOfService() {
  return (
    <InnerAppLayout headerTitle="Terms of Service">
      <MarkdownRender content={termsOfService} />
    </InnerAppLayout>
  );
}
