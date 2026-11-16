"use client";
import { FormEvent, useEffect, useState } from "react";
import NewsAdmin from "@/components/admin/NewsAdmin";
import PagesAdmin from "@/components/admin/PagesAdmin";
import ShrinesAdmin from "@/components/admin/ShrinesAdmin";
import { api } from "@/lib/api";

const TABS = ["News and Alerts", "Shrines", "Pages"] as const;

/** Content manager: login gate, then tabbed editors. */
export default function AdminApp() {
  const [user, setUser] = useState<string | null | undefined>(undefined);
  const [tab, setTab] = useState<(typeof TABS)[number]>("News and Alerts");
  const [message, setMessage] = useState<{ text: string; error: boolean }>();
  const [loginError, setLoginError] = useState<string>();

  useEffect(() => {
    api<{ username: string }>("/me").then((me) => setUser(me.username)).catch(() => setUser(null));
  }, []);

  const login = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    api<{ username: string }>("/login", {
      method: "POST",
      body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
    }).then((me) => { setUser(me.username); setLoginError(undefined); }).catch((e: Error) => setLoginError(e.message));
  };
  const logout = () => api("/logout", { method: "POST" }).then(() => setUser(null));
  const onError = (text: string) => setMessage({ text, error: true });
  const onSaved = (text: string) => setMessage({ text, error: false });

  if (user === undefined) return <p className="state">Loading...</p>;
  if (user === null) {
    return (
      <form className="panel form login" onSubmit={login} aria-label="Login">
        <h1>Content Manager</h1>
        <label>Username<input name="username" autoComplete="username" required /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
        {loginError && <p className="notice notice-error" role="alert">{loginError}</p>}
        <button className="button button-maroon" type="submit">Log in</button>
      </form>
    );
  }

  return (
    <div className="admin">
      <div className="admin-bar">
        <h1>Content Manager</h1>
        <button className="button button-quiet button-small" onClick={logout}>Log out ({user})</button>
      </div>
      <div className="tabs" role="tablist">
        {TABS.map((name) => (
          <button key={name} role="tab" className="tab" aria-selected={tab === name}
                  onClick={() => { setTab(name); setMessage(undefined); }}>{name}</button>
        ))}
      </div>
      {message && <p className={message.error ? "notice notice-error" : "notice"} role={message.error ? "alert" : "status"}>{message.text}</p>}
      {tab === "News and Alerts" && <NewsAdmin onError={onError} />}
      {tab === "Shrines" && <ShrinesAdmin onError={onError} onSaved={onSaved} />}
      {tab === "Pages" && <PagesAdmin onError={onError} onSaved={onSaved} />}
    </div>
  );
}
