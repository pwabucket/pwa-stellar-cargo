import AccountImage from "@/components/AccountImage";
import FullPageSpinner from "@/components/FullPageSpinner";
import InnerAppLayout from "@/layouts/InnerAppLayout";
import useAppStore from "@/store/useAppStore";
import useCheckOrNavigate from "@/hooks/useCheckOrNavigate";
import useContact from "@/hooks/useContact";
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import { IoCopyOutline } from "react-icons/io5";
import { Link, useParams } from "react-router";
import { MenuButton } from "@/components/MenuButton";
import { copyToClipboard, truncatePublicKey } from "@/lib/utils";
import { useCallback } from "react";
import { useNavigate } from "react-router";

export default function ContactDetails() {
  const { id } = useParams();
  const contact = useContact(id);
  const navigate = useNavigate();
  const removeContact = useAppStore((state) => state.removeContact);

  /** Handle Removal */
  const handleContactRemoval = useCallback(async () => {
    removeContact(id);
    navigate("/contacts", { replace: true });
  }, [id, removeContact, navigate]);

  /** Redirect */
  useCheckOrNavigate(contact, "/contacts", {
    replace: true,
  });

  return contact ? (
    <InnerAppLayout
      headerMiddleContent={
        <h3 className="text-center font-bold flex gap-2 items-center justify-center">
          <AccountImage
            publicKey={contact.address}
            className="size-4 shrink-0"
          />{" "}
          {contact.name || "Stellar Account"}
        </h3>
      }
      className="gap-4"
    >
      <div className="flex flex-col gap-1 items-center justify-center">
        {/* Image */}
        <AccountImage
          publicKey={contact.address}
          className="size-20 shrink-0 rounded-full bg-white"
        />

        {/* Contact Name */}
        <h2 className="text-3xl font-light truncate grow min-w-0 flex gap-2 items-center">
          {" "}
          {contact.name || "Stellar Contact"}
        </h2>

        {/* Memo */}
        {contact.memo ? <p className="text-sm">MEMO: {contact.memo}</p> : null}

        {/* Contact Address */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => copyToClipboard(contact.address)}
            className="shrink-0"
          >
            <IoCopyOutline className="size-4" />
          </button>
          <h3 className="truncate grow min-w-0 text-sm">
            <a
              target="_blank"
              href={`https://stellar.expert/explorer/public/account/${contact.address}`}
              className="text-blue-500"
            >
              {truncatePublicKey(contact.address, 8)}
            </a>
          </h3>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2">
        <MenuButton
          as={Link}
          to="edit"
          icon={HiOutlinePencilSquare}
          title="Edit"
        />

        <MenuButton
          onClick={handleContactRemoval}
          icon={HiOutlineTrash}
          title="Delete"
          className="text-red-500"
        />
      </div>
    </InnerAppLayout>
  ) : (
    <FullPageSpinner />
  );
}
