import Logo from "../../components/Logo";
import { loginAdmin } from "./actions";

type AdminLoginProps = {
  error?: string;
};

export default function AdminLogin({ error }: AdminLoginProps) {
  return (
    <section className="admin-login-shell">
      <div className="admin-login-card">
        <Logo size="lg" />
        <div>
          <p className="eyebrow">Admin access</p>
          <h1>ChainBrief Admin</h1>
          <p>
            Enter the temporary admin password to manage draft and published
            articles. Supabase Auth will replace this gate later.
          </p>
        </div>
        <form action={loginAdmin} className="admin-login-form">
          <label>
            Admin password
            <input name="password" placeholder="Enter password" type="password" />
          </label>
          {error === "invalid" ? (
            <p className="form-error">Incorrect password. Try again.</p>
          ) : null}
          {error === "session" ? (
            <p className="form-error">Please sign in before opening admin pages.</p>
          ) : null}
          <button className="button button-primary" type="submit">
            Enter Admin
          </button>
        </form>
      </div>
    </section>
  );
}
