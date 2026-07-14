"use client";

import type { MouseEvent, ReactNode } from "react";

export function ScrollToSectionLink({
  sectionId,
  children,
  className,
}: {
  sectionId: string;
  children: ReactNode;
  className?: string;
}) {
  function scrollToSection(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(sectionId);
    if (!target) return;

    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    window.history.pushState(null, "", `#${sectionId}`);
  }

  return (
    <a
      href={`#${sectionId}`}
      onClick={scrollToSection}
      className={className}
    >
      {children}
    </a>
  );
}
