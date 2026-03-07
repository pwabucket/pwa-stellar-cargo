import type { ComponentProps } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

const FooterLink = ({ className, ...props }: ComponentProps<typeof Link>) => (
  <div className={cn("basis-0 grow", className)}>
    <Link {...props} />
  </div>
);

export default function FooterLinks() {
  return (
    <>
      <div className="flex justify-center gap-2 text-blue-300 text-sm">
        <FooterLink to="/privacy-policy" className={"text-right"}>
          Privacy Policy
        </FooterLink>
        <span className="w-px bg-neutral-800" />
        <FooterLink to="/terms-of-service">Terms of Service</FooterLink>
      </div>

      <div className="flex justify-center gap-2 text-blue-300 text-sm">
        <FooterLink to="/about" className={"text-right"}>
          About
        </FooterLink>
        <span className="w-px bg-neutral-800" />
        <FooterLink to={import.meta.env.VITE_APP_REPOSITORY} target="_blank">
          Source
        </FooterLink>
      </div>

      <p className="text-center text-neutral-400 text-sm">
        v{import.meta.env.PACKAGE_VERSION}
      </p>
    </>
  );
}
