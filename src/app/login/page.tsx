 "use client";

import { FormEvent, useEffect, useState } from "react";
import { Package, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  // const [username, setUsername] = useState("kminchelle");
  // const [password, setPassword] = useState("0lelplR");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (!isLoading && isAuthenticated) router.replace("/products"); }, [isAuthenticated, isLoading, router]);

  async function submit(e: FormEvent) {
    e.preventDefault(); if (busy) return; setBusy(true); setError("");
    try { await login(username, password); router.replace(params.get("redirect") || "/products"); }
    catch (e) { setError(e instanceof Error ? e.message : "Invalid username or password."); }
    finally { setBusy(false); }
  }

  return <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
    <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl md:p-9">
      <div className="mb-8 text-center"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white"><Package /></div><h1 className="text-2xl font-bold">Product Admin</h1><p className="mt-1 text-sm text-slate-500">Sign in to manage products</p></div>
      {error && <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <div><label className="mb-2 block text-sm font-medium">Username</label><input className="input" value={username} onChange={e => setUsername(e.target.value)} /></div>
        <div><label className="mb-2 block text-sm font-medium">Password</label><div className="relative"><input className="input pr-11" type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-2.5 text-slate-400">{show ? <EyeOff size={19}/> : <Eye size={19}/>}</button></div></div>
        <button disabled={busy} className="btn-primary w-full">{busy ? "Signing in..." : "Sign In"}</button>
      </form>
      {/* <div className="mt-5 rounded-xl bg-slate-50 p-3 text-center text-xs text-slate-500">Demo: <b>kminchelle</b> / <b>0lelplR</b></div> */}
      <div className="mt-5 rounded-xl bg-slate-50 p-3 text-center text-xs text-slate-500">Demo: <b>emilys</b> / <b>emilyspass</b></div>
    </div>
  </main>;
}