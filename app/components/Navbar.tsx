"use client";
import { ShoppingBag, Menu, X, User, Search } from "lucide-react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { WordRotate } from "@/components/ui/word-rotate";
import { SearchBar } from "./SearchBar";

interface AppUser {
  isAdmin: boolean;
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const Admin = session?.user ? (session.user as AppUser).isAdmin : false;

  return (
    <>
      {/* Marquee Announcement Bar */}
      <div className="fixed top-0 left-0 w-full h-[30px] md:h-[4.1vh] bg-[#1c1c1c] z-50 overflow-hidden flex justify-center items-center">
        <div className="announcment_bar">
          <WordRotate 
            className="text-white text-xs md:text-sm font-semibold"
            duration={1500}
            words={[
              "EXTENSION OF YOUR EXPRESSION",
              "COLT & CO.",
              "NEW DROP - NOW LIVE",
              "FREE SHIPPING ON ORDERS OVER ₹399"
            ]}
            motionProps={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 },
              transition: { duration: 0.3 }
            }}
          />
        </div>
      </div>

      {/* Navbar */}
      <div className="fixed top-[30px] md:top-[4.1vh] left-0 right-0 z-40 bg-white shadow-md">
        <nav className="max-w-screen-xl mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between py-4">
            {/* Left - Hamburger (mobile) */}
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Center - Logo */}
            <Link
              href="/"
              className="flex justify-center items-center space-x-2"
              onClick={() => setMenuOpen(false)}
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={50}
                height={40}
                className="object-contain"
              />
              <span className="hidden sm:inline-block text-lg font-semibold text-gray-900">
                COLT & CO.
              </span>
            </Link>

            {/* Right - Icons */}
            <div className="flex items-center gap-4">
              <Search 
                className="w-5 h-5 cursor-pointer" 
                onClick={() => setSearchOpen(!searchOpen)}
              />
              {sessionStatus === "loading" ? (
                <div className="w-5 h-5 bg-gray-200 animate-pulse rounded-full"></div>
              ) : session?.user ? (
                <User 
                  className="w-5 h-5 cursor-pointer hidden md:block" 
                  onClick={() => router.push("/order")}
                />
              ) : (
                <User 
                  className="w-5 h-5 cursor-pointer hidden md:block" 
                  onClick={() => router.push("/login")}
                />
              )}
              <ShoppingBag 
                className="w-5 h-5 cursor-pointer" 
                onClick={() => router.push("/cart")}
              />
            </div>
          </div>

          {/* Search Bar (Toggleable) */}
          {searchOpen && (
            <div className="pb-3">
              <SearchBar className="w-full" />
            </div>
          )}

          {/* Desktop menu */}
          <div className="hidden md:flex justify-center gap-10 pb-3 text-sm font-medium text-gray-800 border-t border-gray-200 pt-3">
            <NavLinks 
              session={session} 
              Admin={Admin} 
              sessionStatus={sessionStatus}
              onLogout={() => {
                signOut({ callbackUrl: "/login" });
                toast({
                  title: "Success",
                  description: "Logged out successfully",
                  duration: 3000,
                  variant: "default",
                  style: { backgroundColor: "#191919", color: "#fff" },
                });
              }}
            />
          </div>

          {/* Mobile dropdown menu */}
          {menuOpen && (
            <div className="md:hidden flex flex-col items-center gap-4 py-4 border-t border-gray-200 text-gray-800 bg-white">
              <NavLinks 
                session={session} 
                Admin={Admin} 
                sessionStatus={sessionStatus}
                onLogout={() => {
                  signOut({ callbackUrl: "/login" });
                  toast({
                    title: "Success",
                    description: "Logged out successfully",
                    duration: 3000,
                    variant: "default",
                    style: { backgroundColor: "#191919", color: "#fff" },
                  });
                  setMenuOpen(false);
                }}
                onLinkClick={() => setMenuOpen(false)}
              />
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

// ✨ Separate component for links (cleaner)
function NavLinks({ 
  session, 
  Admin, 
  sessionStatus,
  onLogout,
  onLinkClick 
}: { 
  session: any; 
  Admin: boolean; 
  sessionStatus: string;
  onLogout: () => void;
  onLinkClick?: () => void;
}) {
  return (
    <>
      <Link 
        href="/" 
        className="hover:underline underline-offset-4"
        onClick={onLinkClick}
      >
        Home
      </Link>
      <Link 
        href="/products" 
        className="hover:underline underline-offset-4"
        onClick={onLinkClick}
      >
        Shop
      </Link>
      {/* <Link 
        href="/category" 
        className="hover:underline underline-offset-4"
        onClick={onLinkClick}
      >
        Category
      </Link> */}
      <Link 
        href="/contact" 
        className="hover:underline underline-offset-4"
        onClick={onLinkClick}
      >
        Contact
      </Link>
      <Link 
        href={session?.user ? "/order" : "/login"} 
        className="hover:underline underline-offset-4"
        onClick={onLinkClick}
      >
        Orders
      </Link>
      {Admin && (
        <Link 
          href={session?.user ? "/dashboard" : "/login"} 
          className="hover:underline underline-offset-4"
          onClick={onLinkClick}
        >
          Dashboard
        </Link>
      )}
      {sessionStatus === "loading" ? (
        <div className="w-16 h-6 bg-gray-200 animate-pulse rounded"></div>
      ) : session?.user ? (
        <button
          onClick={onLogout}
          className="hover:underline underline-offset-4"
        >
          Logout
        </button>
      ) : (
        <Link 
          href="/login" 
          className="hover:underline underline-offset-4"
          onClick={onLinkClick}
        >
          Login
        </Link>
      )}
    </>
  );
}

export default Navbar;
