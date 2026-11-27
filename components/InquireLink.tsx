"use client";

import { ArrowRight } from "lucide-react";
import type { ProductValue } from "@/lib/site";

export const SELECT_EVENT = "eg:select-product";

/** Link that scrolls to the inquiry form and pre-selects a product. */
export default function InquireLink({
  product,
  children,
  className = "product-link",
}: {
  product: ProductValue;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href="#inquiry"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(SELECT_EVENT, { detail: product }))}
    >
      {children} <ArrowRight aria-hidden />
    </a>
  );
}
