import { Link } from "react-router-dom";

const LOGO_URL =
  "https://unixwmlawlmpsycmuwhy.supabase.co/storage/v1/object/sign/logo/black.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5Xzk4ZmU2MmMxLTFlNGQtNDRhOS1hOWM5LWYwNDY2NjFiZThmYyJ9.eyJ1cmwiOiJsb2dvL2JsYWNrLnBuZyIsImlhdCI6MTc0NjYzOTExMCwiZXhwIjoyMDYxOTk5MTEwfQ.dgkVjSHznMp6gb-vpj4vDbDWi2XV4ytf4AHIoUUIp5o";

interface LogoProps {
  className?: string;
  /**
   * Render the logo wrapped in a home link. Disable when the parent already handles navigation
   * to avoid nested anchors.
   */
  withLink?: boolean;
}

export default function Logo({ className = "flex items-center", withLink = true }: LogoProps) {
  const image = (
    <img
      src={LOGO_URL}
      alt="Goodplans Logo"
      className="h-10 sm:h-12 md:h-14 w-auto object-contain"
    />
  );

  if (!withLink) {
    return <div className={className}>{image}</div>;
  }

  return (
    <Link to="/" className={className} aria-label="Retour à l’accueil">
      {image}
    </Link>
  );
}
