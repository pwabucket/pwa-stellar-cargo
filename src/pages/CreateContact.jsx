import ContactForm from "@/partials/ContactForm";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import { useNavigate } from "react-router";

export default function CreateContact() {
  const navigate = useNavigate();

  const onSaved = () => {
    navigate("/contacts", {
      replace: true,
    });
  };

  return (
    <InnerAppLayout headerTitle="Create Contact">
      <ContactForm onSaved={onSaved} />
    </InnerAppLayout>
  );
}
