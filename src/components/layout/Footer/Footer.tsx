import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook", icon: Facebook },
  { href: "https://instagram.com", label: "Instagram", icon: Instagram },
  { href: "https://linkedin.com", label: "LinkedIn", icon: Linkedin },
];

const quickLinks = [
  { to: "/about", label: "À propos" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

const categoryLinks = [
  { to: "/category/immobilier", label: "Immobilier" },
  { to: "/category/vehicules", label: "Véhicules" },
  { to: "/category/services", label: "Services" },
  { to: "/category/artisanat", label: "Artisanat" },
];

const legalLinks = [
  { to: "/privacy", label: "Confidentialité" },
  { to: "/terms", label: "Conditions" },
  { to: "/cookies", label: "Cookies" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              La première plateforme d'annonces au Maroc. Trouvez tout ce dont vous avez
              besoin ou vendez facilement ce que vous n'utilisez plus.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600 shadow-sm"
                    aria-label={link.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <LinkList title="Liens rapides" links={quickLinks} />
          <LinkList title="Catégories" links={categoryLinks} />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Nous contacter</h3>
            <p className="text-gray-600">support@goodplans.ma</p>
            <p className="text-gray-600">+212 6 12 34 56 78</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} GoodPlans. Tous droits réservés.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {legalLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-gray-500 hover:text-blue-600">
                {link.label}
              </Link>
            ))}
            <Link to="/admin" className="text-gray-500 hover:text-blue-600">
              Administration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function LinkList({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="text-gray-600 hover:text-blue-600">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
