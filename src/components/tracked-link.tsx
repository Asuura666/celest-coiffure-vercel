"use client";

import { track } from "@vercel/analytics";
import type { ReactNode } from "react";

type Props = {
  href: string;
  eventName: string;
  location: string;
  className?: string;
  children: ReactNode;
  target?: string;
};

export function TrackedLink({
  href,
  eventName,
  location,
  className,
  children,
  target,
}: Props) {
  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={target === "_blank" ? "noreferrer" : undefined}
      onClick={() => track(eventName, { location })}
    >
      {children}
    </a>
  );
}
