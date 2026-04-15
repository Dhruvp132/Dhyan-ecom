"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { Instagram } from "lucide-react";

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll("[data-cascade]");
            elements.forEach((el) => {
              el.classList.add("animate-in");
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="bg-primary text-[#ECF2F5] border-t border-white/10">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* SHOP Column */}
          <div data-cascade style={{ "--animation-order": 0 } as React.CSSProperties}>
            <h2 className="text-lg font-semibold mb-6 tracking-wide">SHOP</h2>
            <ul className="space-y-3">
              {["Home", "Products", "Category", "On Sale", "Track Your Order"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#ECF2F5]/78 hover:text-white transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* LEGAL Column */}
          <div data-cascade style={{ "--animation-order": 1 } as React.CSSProperties}>
            <h2 className="text-lg font-semibold mb-6 tracking-wide">LEGAL</h2>
            <ul className="space-y-3">
              {[
                "Search",
                "Terms of Service",
                "Shipping Policy",
                "Refund Policy",
                "Privacy Policy",
                "Contact Information",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#ECF2F5]/78 hover:text-white transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* HEADQUARTERS Column */}
          <div data-cascade style={{ "--animation-order": 2 } as React.CSSProperties}>
            <h2 className="text-lg font-semibold mb-6 tracking-wide">HEADQUARTERS</h2>
            <div className="space-y-4 text-[#ECF2F5]/78">
              <p>COLT & CO. Clothing Store, Fashion District, Style Avenue</p>
              <a
                href="mailto:hello@coltandco.com"
                className="block underline hover:text-white transition-colors duration-200"
              >
                hello@coltandco.com
              </a>
              <a href="tel:+1234567890" className="block underline hover:text-white transition-colors duration-200">
                +1 (234) 567-890
              </a>
            </div>
          </div>

          {/* Newsletter Column */}
          <div data-cascade style={{ "--animation-order": 3 } as React.CSSProperties}>
            <h2 className="text-lg font-semibold mb-6 tracking-wide">Subscribe to our emails</h2>
            <form className="flex">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 bg-white/8 border border-white/20 px-4 py-3 text-white placeholder:text-[#ECF2F5]/50 focus:outline-none focus:border-white transition-colors duration-200"
              />
              <button
                type="submit"
                className="border border-white/20 px-4 py-3 hover:border-white hover:bg-white/10 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="w-4 h-4" viewBox="0 0 14 10">
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M8.537.808a.5.5 0 0 1 .817-.162l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 1 1-.708-.708L11.793 5.5H1a.5.5 0 0 1 0-1h10.793L8.646 1.354a.5.5 0 0 1-.109-.546"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Instagram Icon */}
        <div className="flex justify-end mb-12">
          <a
            href="https://www.instagram.com/coltandco"
            className="text-[#ECF2F5]/78 hover:text-white transition-colors duration-200"
          >
            <Instagram size={24} />
          </a>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-[#ECF2F5]/68">
            <div>© 2025, COLT & CO.</div>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="hover:text-white transition-colors duration-200">
                Privacy policy
              </a>
              <span>·</span>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Terms of service
              </a>
              <span>·</span>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Shipping policy
              </a>
              <span>·</span>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Refund policy
              </a>
              <span>·</span>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Contact information
              </a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
