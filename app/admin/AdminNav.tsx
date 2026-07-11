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
        <Link href="/admin/banners">Banners</Link>
        <Link href="/admin/banners/new">New Banner</Link>
        <Link href="/admin/projects">Projects</Link>
        <Link href="/admin/projects/new">New Project</Link>
        <Link href="/admin/projects/import">Import Projects</Link>
        <Link href="/admin/sources">Sources</Link>
        <Link href="/admin/import">Import News</Link>
        <Link href="/admin/requests">Requests</Link>
        <Link href="/admin/requests/contact">Contact Requests</Link>
        <Link href="/admin/requests/projects">Project Submissions</Link>
      </nav>
      <form action={logoutAdmin}>
        <button className="button button-secondary admin-logout" type="submit">
          Sign Out
        </button>
      </form>
    </header>
  );
}
