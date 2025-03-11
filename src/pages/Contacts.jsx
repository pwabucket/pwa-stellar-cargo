import ContactList from "@/partials/ContactList";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import { HeaderButton } from "@/components/HeaderButton";
import { Link } from "react-router";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
export default function Contacts() {
  return (
    <InnerAppLayout
      headerTitle="Contacts"
      headerRightContent={
        <HeaderButton as={Link} to={"create"} icon={AiOutlineUsergroupAdd} />
      }
    >
      <ContactList />
    </InnerAppLayout>
  );
}
