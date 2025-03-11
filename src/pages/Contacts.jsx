import ContactList from "@/partials/ContactList";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import { HeaderButton } from "@/components/HeaderButton";
import { HiOutlineUserPlus } from "react-icons/hi2";
import { Link } from "react-router";

export default function Contacts() {
  return (
    <InnerAppLayout
      headerTitle="Contacts"
      headerRightContent={
        <HeaderButton as={Link} to={"create"} icon={HiOutlineUserPlus} />
      }
    >
      <ContactList />
    </InnerAppLayout>
  );
}
