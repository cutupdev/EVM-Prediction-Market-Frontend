import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function AppHeader() {
  return (
    <header className="header-bar">
      <div className="header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden />
          <span>Predex</span>
        </Link>
        <nav className="nav" aria-label="Main">
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
        </nav>
      </div>
    </header>
  );
}
