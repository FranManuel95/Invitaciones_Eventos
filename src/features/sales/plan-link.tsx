"use client";

import type { ReactNode } from "react";
import { PLAN_EVENT } from "./plan-event";
import type { PlanId } from "@/lib/sales/plans";

/** Enlace al formulario que, además, deja elegido el paquete. */
export function PlanLink({
  plan,
  className,
  children,
}: {
  plan: PlanId;
  className: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#pedir"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(PLAN_EVENT, { detail: plan }))}
    >
      {children}
    </a>
  );
}
