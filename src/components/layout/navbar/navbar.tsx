import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  PlusCircle,
  MessageSquare,
} from "lucide-react";

import Logo from "../../Logo";

import { useAuth } from "../../../features/auth/AuthContext"; 
import { useFetch } from "../../../hooks/useFetch";

import {
  MessageIcon,
  DesktopProfileMenu,
  MobileMenu,
} from "./NavbarSections";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();

  const isAuthenticated = !!user;

  /* ------------------------------------------------------------------
     Fetch des messages non lus
  ------------------------------------------------------------------ */

  const {
    data: unread,
    refetch: refetchUnread,
  } = useFetch<number>(
    "/messages/unread-count",
    { method: "GET" }
  );

  const unreadMessages = unread ?? 0;

  const {
    data: profile,
  } = useFetch("/users/me/profile", {
    method: "GET",
    skip: !isAuthenticated,
  });

  const canPostListing = hasPermission("listing.create");
  const canAccessMessages = hasPermission("messages.access");
  const canSeeSellerDashboard = hasPermission("seller.stats.view");

  /* ------------------------------------------------------------------
     UI State
  ------------------------------------------------------------------ */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  function closeAllMenus() {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }

  /* ------------------------------------------------------------------
     Actions
  ------------------------------------------------------------------ */

  function handlePostListing() {
    if (!canPostListing) {
      navigate("/profile");
      return;
    }
    navigate("/create-listing");
  }

  function handleMessages() {
    navigate("/messages");
    refetchUnread();
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  /* ------------------------------------------------------------------
     RENDER
  ------------------------------------------------------------------ */

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-3">
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">

            {/* Déposer annonce */}
            {isAuthenticated && (
              <button
                onClick={handlePostListing}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-white 
                  ${canPostListing ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}
                `}
              >
                <PlusCircle className="h-5 w-5" />
                <span>Publier</span>
              </button>
            )}

            {/* Messages */}
            {isAuthenticated && canAccessMessages && (
              <button
                onClick={handleMessages}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <MessageIcon unreadMessages={unreadMessages} />
              </button>
            )}

            {/* MENU DESKTOP */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                <DesktopProfileMenu
                  user={user}
                  isOpen={isProfileOpen}
                  onToggle={() => setIsProfileOpen((v) => !v)}
                  onLogout={handleLogout}
                  canSeeSellerDashboard={canSeeSellerDashboard}
                  closeAll={closeAllMenus}
                  t={(k: string, d?: string) => d ?? k} // fallback simple
                />
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50"
                >
                  Connexion
                </Link>
              )}
            </div>

            {/* BURGER MOBILE */}
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-full bg-gray-100"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      <MobileMenu
        isOpen={isMenuOpen}
        closeAll={closeAllMenus}
        user={user}
        isAuthenticated={isAuthenticated}
        unreadMessages={unreadMessages}
        canPostListing={canPostListing}
        canAccessMessages={canAccessMessages}
        canSeeSellerDashboard={canSeeSellerDashboard}
        onLogout={handleLogout}
        onPostListing={handlePostListing}
        onMessages={handleMessages}
        headerSlot={<Logo />}
        t={(k: string, d?: string) => d ?? k}
      />
    </nav>
  );
}
