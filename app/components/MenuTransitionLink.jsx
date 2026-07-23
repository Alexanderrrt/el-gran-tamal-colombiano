"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * MenuTransitionLink — Branded navigation from the homepage to the menu.
 * Preserves normal link behavior for modifier clicks and reduced-motion users.
 */
export function MenuTransitionLink({ href, locale = "es", className, children }) {
  const router = useRouter();
  const timerRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    document.body.style.overflow = "";
  }, []);

  const handleClick = (event) => {
    const usesModifiedClick = event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (event.defaultPrevented || usesModifiedClick || prefersReducedMotion || isTransitioning) return;

    event.preventDefault();
    document.body.style.overflow = "hidden";
    setIsTransitioning(true);
    timerRef.current = window.setTimeout(() => router.push(href), 900);
  };

  return (
    <>
      <Link className={className} href={href} onClick={handleClick} aria-disabled={isTransitioning}>
        {children}
      </Link>
      {isTransitioning ? createPortal(
        <div
          className="menu-transition menu-transition--active"
          role="status"
          aria-live="polite"
          aria-label={locale === "es" ? "Abriendo el menú" : "Opening the menu"}
        >
          <div className="menu-transition__flag" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="menu-transition__mark">
            <span className="menu-transition__ring" aria-hidden="true" />
            <Image
              className="menu-transition__logo"
              src="/media/logo.webp"
              width={148}
              height={148}
              alt=""
              priority
            />
            <p>{locale === "es" ? "Preparando tu mesa" : "Bringing the menu to your table"}</p>
            <small>{locale === "es" ? "El sabor de Colombia" : "The flavor of Colombia"}</small>
          </div>
        </div>,
        document.body,
      ) : null}
    </>
  );
}
