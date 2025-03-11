import ContactForm from "@/partials/ContactForm";
import FullPageSpinner from "@/components/FullPageSpinner";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import useCheckOrNavigate from "@/hooks/useCheckOrNavigate";
import useContact from "@/hooks/useContact";
import { useNavigate } from "react-router";
import { useParams } from "react-router";

export default function EditContact() {
  const { id } = useParams();
  const contact = useContact(id);
  const navigate = useNavigate();

  const handleSaved = () => {
    /** Return */
    navigate(-1, { replace: true });
  };

  /** Redirect */
  useCheckOrNavigate(contact, "/contacts", {
    replace: true,
  });

  return contact ? (
    <InnerAppLayout headerTitle="Edit Contact">
      <ContactForm contact={contact} onSaved={handleSaved} />
    </InnerAppLayout>
  ) : (
    <FullPageSpinner />
  );
}
