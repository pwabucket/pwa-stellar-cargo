import { Link } from "react-router";
import { cn } from "@/lib/utils";

const FooterLink = ({ className, ...props }) => (
  <div className={cn("basis-0 grow", className)}>
    <Link {...props} />
  </div>
);

export default function FooterLinks() {
  return (
    <>
      <div className="flex justify-center gap-2 text-blue-500 dark:text-blue-400">
        <FooterLink to="/privacy-policy" className={"text-right"}>
          Privacy Policy
        </FooterLink>
        <span className="w-px  bg-neutral-200 dark:bg-neutral-700 " />
        <FooterLink to="/terms-of-service">Terms of Service</FooterLink>
      </div>

      <div className="flex justify-center gap-2 text-blue-500 dark:text-blue-400">
        <FooterLink to="/about" className={"text-right"}>
          About
        </FooterLink>
        <span className="w-px  bg-neutral-200 dark:bg-neutral-700" />
        <FooterLink to={import.meta.env.VITE_APP_REPOSITORY} target="_blank">
          Source
        </FooterLink>
      </div>
    </>
  );
}
