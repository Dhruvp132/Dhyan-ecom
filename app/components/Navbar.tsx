"use client";
import { ShoppingBag, Menu, X, User, Search } from "lucide-react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { WordRotate } from "@/components/ui/word-rotate";
import { SearchBar } from "./SearchBar";
import { useAppDispatch, useAppSelector } from "@/providers/toolkit/hooks/hooks";
import { clearAuth, setAuthUser, setSessionStatus } from "@/providers/toolkit/features/AuthSlice";
import { clearCart } from "@/providers/toolkit/features/AddToCartSlice";
import { clearCartItems } from "@/providers/toolkit/features/GetUserAllCartitems";
import { clearAddress } from "@/providers/toolkit/features/CreateAddressForOrderSlice";
import { clearOrders } from "@/providers/toolkit/features/GetOrdersSlice";

interface AppUser {
  id?: string;
  email?: string | null;
  name?: string | null;
  isAdmin: boolean;
}

const navTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1] as const,
};

const iconSpring = {
  type: "spring" as const,
  stiffness: 220,
  damping: 18,
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const router = useRouter();

  const syncUser = session?.user as AppUser | undefined;

  useEffect(() => {
    if (sessionStatus === "loading") {
      dispatch(setSessionStatus("loading"));
      return;
    }

    if (syncUser) {
      dispatch(
        setAuthUser({
          id: syncUser.id || "",
          email: syncUser.email,
          name: syncUser.name,
          isAdmin: syncUser.isAdmin || false,
        })
      );
      return;
    }

    dispatch(clearAuth());
  }, [dispatch, sessionStatus, syncUser]);

  const isAuthenticated = authState.isAuthenticated || !!syncUser;
  const shouldShowAuthLoading = sessionStatus === "loading" && !isAuthenticated;
  const Admin = useMemo(
    () => authState.user?.isAdmin || syncUser?.isAdmin || false,
    [authState.user?.isAdmin, syncUser?.isAdmin]
  );

  const toggleMenu = () => {
    setMenuOpen((open) => {
      const next = !open;
      if (next) {
        setSearchOpen(false);
      }
      return next;
    });
  };

  const toggleSearch = () => {
    setSearchOpen((open) => {
      const next = !open;
      if (next) {
        setMenuOpen(false);
      }
      return next;
    });
  };

  const handleLogout = async (closeMenu = false) => {
    dispatch(clearCart());
    dispatch(clearCartItems());
    dispatch(clearAddress());
    dispatch(clearOrders());
    dispatch(clearAuth());

    if (closeMenu) {
      setMenuOpen(false);
    }

    await signOut({ callbackUrl: "/login" });

    toast({
      title: "Success",
      description: "Logged out successfully",
      duration: 3000,
      variant: "default",
      style: { backgroundColor: "#23446C", color: "#ECF2F5" },
    });
  };

  return (
    <>
      {/* Marquee Announcement Bar */}
      <div className="fixed top-0 left-0 w-full h-[30px] md:h-[4.1vh] bg-primary z-50 overflow-hidden flex justify-center items-center border-b border-white/10">
        <div className="announcment_bar">
          <WordRotate 
            className="text-[#ECF2F5] text-xs md:text-sm font-semibold"
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
      <div className="fixed top-[30px] md:top-[4.1vh] left-0 right-0 z-40 bg-white backdrop-blur-md shadow-[0_12px_30px_rgba(35,68,108,0.08)] border-b border-border">
        <nav className="max-w-screen-xl mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between py-4">
            {/* Left - Hamburger (mobile) */}
            <motion.button
              type="button"
              className="md:hidden"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.94 }}
              transition={iconSpring}
            >
              <motion.span
                className="flex"
                animate={{ rotate: menuOpen ? 90 : 0 }}
                transition={iconSpring}
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.span>
            </motion.button>

            {/* Center - Logo */}
            <Link
              href="/"
              className="flex justify-center items-center space-x-2"
              onClick={() => setMenuOpen(false)}
            >
              <Image
                priority
                src="/coltLogo.webp"
                alt="Logo"
                width={70}
                height={70}
                className="object-contain"
              />
              <span className="hidden sm:inline-block text-lg font-semibold text-gray-900">
                COLT & CO.
              </span>
            </Link>

            {/* Right - Icons */}
            <div className="flex items-center gap-4">
              <motion.button
                type="button"
                className="text-gray-900"
                onClick={toggleSearch}
                aria-label={searchOpen ? "Close search" : "Open search"}
                aria-expanded={searchOpen}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={iconSpring}
              >
                <motion.span
                  className="flex"
                  animate={{ rotate: searchOpen ? 90 : 0, scale: searchOpen ? 1.05 : 1 }}
                  transition={iconSpring}
                >
                  <Search className="w-5 h-5 cursor-pointer hover:text-[#2F5A8A]" />
                </motion.span>
              </motion.button>
              {shouldShowAuthLoading ? (
                <div className="w-5 h-5 bg-secondary/40 animate-pulse rounded-full"></div>
              ) : isAuthenticated ? (
                <User 
                  className="w-5 h-5 cursor-pointer md:block text-gray-900 hover:text-[#2F5A8A]" 
                  onClick={() => router.push("/profile")}
                />
              ) : (
                <User 
                  className="w-5 h-5 cursor-pointer md:block text-gray-900 hover:text-[#2F5A8A]" 
                  onClick={() => router.push("/login")}
                />
              )}
              <ShoppingBag 
                className="w-5 h-5 cursor-pointer text-gray-900 hover:text-[#2F5A8A]" 
                onClick={() => router.push("/cart")}
              />
            </div>
          </div>

          {/* Search Bar (Toggleable) */}
          <AnimatePresence initial={false}>
            {searchOpen && (
              <motion.div
                key="search-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={navTransition}
                className="overflow-hidden"
              >
                <motion.div
                  initial={{ y: -10, scale: 0.98 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: -8, scale: 0.98 }}
                  transition={navTransition}
                  className="pb-3"
                >
                  <SearchBar className="w-full" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop menu */}
          <div className="hidden md:flex justify-center gap-10 pb-3 text-sm font-medium text-gray-800 border-t border-gray-200 pt-3">
            <NavLinks 
              Admin={Admin} 
              isAuthenticated={isAuthenticated}
                shouldShowAuthLoading={shouldShowAuthLoading}
              onLogout={() => handleLogout(false)}
            />
          </div>

          {/* Mobile dropdown menu */}
          <AnimatePresence initial={false}>
            {menuOpen && (
              <motion.div
                key="mobile-menu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={navTransition}
                className="overflow-hidden md:hidden"
              >
                <motion.div
                  initial={{ y: -12, scale: 0.98 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: -10, scale: 0.98 }}
                  transition={navTransition}
                  className="flex flex-col items-center gap-4 py-4 border-t border-gray-200 text-gray-800 bg-white"
                >
                  <NavLinks 
                    Admin={Admin} 
                    isAuthenticated={isAuthenticated}
                    shouldShowAuthLoading={shouldShowAuthLoading}
                    onLogout={() => handleLogout(true)}
                    onLinkClick={() => setMenuOpen(false)}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </>
  );
};

// ✨ Separate component for links (cleaner)
function NavLinks({ 
  Admin, 
  isAuthenticated,
  shouldShowAuthLoading,
  onLogout,
  onLinkClick 
}: { 
  Admin: boolean; 
  isAuthenticated: boolean;
  shouldShowAuthLoading: boolean;
  onLogout: () => void;
  onLinkClick?: () => void;
}) {
  return (
    <>
      <Link 
        href="/" 
        className="text-gray-900 hover:text-[#2F5A8A] hover:underline underline-offset-4"
        onClick={onLinkClick}
      >
        Home
      </Link>
      <Link 
        href="/products" 
        className="text-gray-900 hover:text-[#2F5A8A] hover:underline underline-offset-4"
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
        className="text-gray-900 hover:text-[#2F5A8A] hover:underline underline-offset-4"
        onClick={onLinkClick}
      >
        Contact
      </Link>
      <Link 
        href={isAuthenticated ? "/order" : "/login"} 
        className="text-gray-900 hover:text-[#2F5A8A] hover:underline underline-offset-4"
        onClick={onLinkClick}
      >
        Orders
      </Link>
      {Admin && (
        <Link 
          href={isAuthenticated ? "/dashboard" : "/login"} 
          className="text-gray-900 hover:text-[#2F5A8A] hover:underline underline-offset-4"
          onClick={onLinkClick}
        >
          Dashboard
        </Link>
      )}
      {shouldShowAuthLoading ? (
        <button
          disabled
          className="text-gray-900 hover:text-[#2F5A8A] hover:underline underline-offset-4"
        >
          Loading...
        </button>
      ) : isAuthenticated ? (
        <button
          onClick={onLogout}
          className="text-gray-900 hover:text-[#2F5A8A] hover:underline underline-offset-4"
        >
          Logout
        </button>
      ) : (
        <Link 
          href="/login" 
          className="text-gray-900 hover:text-[#2F5A8A] hover:underline underline-offset-4"
          onClick={onLinkClick}
        >
          Login
        </Link>
      )}
    </>
  );
}

export default Navbar;
