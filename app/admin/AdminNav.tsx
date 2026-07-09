import Link from "next/link";
import Logo from "../../components/Logo";
import { logoutAdmin } from "./actions";

export default function AdminNav() {
  return (
    <header className="admin-header">
      <Link href="/admin" aria-label="ChainBrief admin home">
        <Logo />
      </Link>
      <nav aria-label="Admin navigation">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/articles">Articles</Link>
        <Link href="/admin/articles/new">New Article</Link>
      </nav>
      <form action={logoutAdmin}>
        <button className="button button-secondary admin-logout" type="submit">
          Sign Out
        </button>
      </form>
    </header>
  );
}
