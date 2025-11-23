// src/components/navbar/NavbarSections.tsx
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  LogOut,
  User,
  Settings,
  Home,
  Search,
  MessageSquare,
  PlusCircle,
  LayoutDashboard as ChartBar,
} from "lucide-react";
import type { AuthUser } from "../../../features/auth/type";

export function MessageIcon({ unreadMessages }: { unreadMessages: number }) {
  return (
    <div className="relative">
      <MessageSquare className="h-5 w-5" />
      {unreadMessages > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          {Math.min(unreadMessages, 9)}
        </span>
      )}
    </div>
  );
}

/* ===========================================================================
   Desktop Profile Menu
============================================================================ */

export function DesktopProfileMenu({
  user,
  isOpen,
  onToggle,
  onLogout,
  canSeeSellerDashboard,
  closeAll,
  t,
}: {
  user: AuthUser;
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
  canSeeSellerDashboard: boolean;
  closeAll: () => void;
  t: any;
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
          {user.email.charAt(0).toUpperCase()}
        </div>

        <span className="font-medium text-sm">
          {user.email.split("@")[0]}
        </span>

        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 rounded-xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden z-50">
          <div className="p-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-700">
              {user.email}
            </p>
          </div>

          <div className="py-1">

            {canSeeSellerDashboard && (
              <Link
                to="/seller/dashboard"
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                onClick={closeAll}
              >
                <ChartBar className="mr-3 h-5 w-5 text-gray-500" />
                Tableau de bord
              </Link>
            )}

            <Link
              to="/profile"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              onClick={closeAll}
            >
              <User className="mr-3 h-5 w-5 text-gray-500" />
              {t("nav.profile", "Profil")}
            </Link>

            <Link
              to="/settings"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              onClick={closeAll}
            >
              <Settings className="mr-3 h-5 w-5 text-gray-500" />
              {t("nav.settings", "Paramètres")}
            </Link>

            <div className="border-t border-gray-100 my-1"></div>

            <button
              onClick={onLogout}
              className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5" />
              {t("nav.logout", "Déconnexion")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===========================================================================
   Mobile Menu
============================================================================ */

export function MobileMenu({
  isOpen,
  closeAll,
  user,
  unreadMessages,
  isAuthenticated,
  canPostListing,
  canAccessMessages,
  canSeeSellerDashboard,
  onLogout,
  onPostListing,
  onMessages,
  t,
  headerSlot,
}: {
  isOpen: boolean;
  closeAll: () => void;
  user: AuthUser | null;
  isAuthenticated: boolean;
  unreadMessages: number;
  canPostListing: boolean;
  canAccessMessages: boolean;
  canSeeSellerDashboard: boolean;
  onLogout: () => void;
  onPostListing: () => void;
  onMessages: () => void;
  t: any;
  headerSlot?: React.ReactNode;
}) {
  return (
    <div
      className={`fixed inset-0 z-40 transition-all duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/20 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeAll}
      />

      {/* Right panel */}
      <div
        className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            {headerSlot}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">

            {/* Profile summary */}
            {isAuthenticated && user && (
              <div className="p-3 bg-gray-50 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-bold">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {user.email.split("@")[0]}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Links */}
            <Link
              to="/"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
              onClick={closeAll}
            >
              <Home className="h-5 w-5 text-gray-500" />
              {t("nav.home", "Accueil")}
            </Link>

            <Link
              to="/search"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
              onClick={closeAll}
            >
              <Search className="h-5 w-5 text-gray-500" />
              {t("nav.search", "Rechercher")}
            </Link>

            {/* Post Listing */}
            {isAuthenticated && (
              <button
                onClick={() => {
                  onPostListing();
                  closeAll();
                }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 w-full text-left"
              >
                <PlusCircle className="h-5 w-5 text-gray-500" />
                {t("nav.postListing", "Déposer une annonce")}
              </button>
            )}

            {/* Messages */}
            {isAuthenticated && canAccessMessages && (
              <button
                onClick={() => {
                  onMessages();
                  closeAll();
                }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 w-full text-left"
              >
                <MessageSquare className="h-5 w-5 text-gray-500" />
                {t("nav.chat", "Messages")}

                {unreadMessages > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {Math.min(unreadMessages, 9)}
                  </span>
                )}
              </button>
            )}

            {/* Profile */}
            {isAuthenticated && (
              <Link
                to="/profile"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                onClick={closeAll}
              >
                <User className="h-5 w-5 text-gray-500" />
                {t("nav.profile", "Profil")}
              </Link>
            )}

            {/* Seller Dashboard */}
            {isAuthenticated && canSeeSellerDashboard && (
              <Link
                to="/seller/dashboard"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                onClick={closeAll}
              >
                <ChartBar className="h-5 w-5 text-gray-500" />
                {t("nav.sellerDashboard", "Vendeur")}
              </Link>
            )}

            {/* Settings */}
            {isAuthenticated && (
              <Link
                to="/settings"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                onClick={closeAll}
              >
                <Settings className="h-5 w-5 text-gray-500" />
                {t("nav.settings", "Paramètres")}
              </Link>
            )}

            {/* Logout */}
            {isAuthenticated && (
              <button
                onClick={() => {
                  onLogout();
                  closeAll();
                }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 w-full"
              >
                <LogOut className="h-5 w-5" />
                {t("nav.logout", "Déconnexion")}
              </button>
            )}

            {/* Login */}
            {!isAuthenticated && (
              <Link
                to="/login"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                onClick={closeAll}
              >
                <User className="h-5 w-5 text-gray-500" />
                {t("auth.signIn", "Connexion")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
