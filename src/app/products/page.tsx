 "use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search, RotateCcw, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import ProductTable from "@/components/products/ProductTable";
import Pagination from "@/components/products/Pagination";
import { getCategories, getProducts, getProductsByCategory, searchProducts } from "@/services/productService";
import { mergeLocalProducts } from "@/lib/storage";
import { Product } from "@/types/product";
import { safeLimit, safePage } from "@/lib/utils";

export default function ProductsPage() {
  const router = useRouter(), params = useSearchParams();
  const page = safePage(params.get("page")), limit = safeLimit(params.get("limit"));
  const q = params.get("q") || "", category = params.get("category") || "", sortBy = params.get("sortBy") || "id", order = params.get("order") || "asc";
  const [products, setProducts] = useState<Product[]>([]), [total, setTotal] = useState(0), [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true), [error, setError] = useState(""), [input, setInput] = useState(q);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => { setInput(q); }, [q]);
  useEffect(() => { getCategories().then(setCategories).catch(() => setCategories([])); }, []);

  const update = useCallback((changes: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(changes).forEach(([k,v]) => v ? next.set(k,v) : next.delete(k));
    router.push(`/products?${next.toString()}`);
  }, [params, router]);

  useEffect(() => {
    let alive = true;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true); setError("");
    (async () => {
      try {
        let result;
        if (q && category) {
          const categoryData = await getProductsByCategory(category, { limit: 0, skip: 0 });
          const filtered = categoryData.products.filter(p => p.title.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase()));
          const sorted = sortProducts(filtered, sortBy, order);
          const start = (page - 1) * limit;
          result = { products: sorted.slice(start, start + limit), total: sorted.length };
        } else if (q) {
          result = await searchProducts({ q, limit, skip: (page - 1) * limit }, controller.signal);
          result = { ...result, products: sortProducts(result.products, sortBy, order) };
        } else if (category) {
          result = await getProductsByCategory(category, { limit, skip: (page - 1) * limit });
          result = { ...result, products: sortProducts(result.products, sortBy, order) };
        } else {
          result = await getProducts({ limit, skip: (page - 1) * limit });
          result = { ...result, products: sortProducts(result.products, sortBy, order) };
        }
        if (!alive) return;
        const merged = mergeLocalProducts(result.products);
        setProducts(merged);
        setTotal(q && category ? result.total : result.total + mergeLocalProducts([]).length);
      } catch (e) {
        if (!alive || (e instanceof Error && e.name === "CanceledError")) return;
        setError(e instanceof Error ? e.message : "Could not load products.");
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; controller.abort(); };
  }, [q, category, page, limit, sortBy, order]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const reset = () => router.push("/products");
  const statusStart = total ? (page - 1) * limit + 1 : 0, statusEnd = Math.min(page * limit, total);

  return <DashboardShell>
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-bold">Products</h2><p className="text-sm text-slate-500">Manage your product catalog</p></div><Link href="/products/new" className="btn-primary inline-flex items-center justify-center gap-2"><Plus size={18}/> Add Product</Link></div>
      <div className="rounded-2xl border bg-white p-4 shadow-soft">
        <div className="grid gap-3 lg:grid-cols-[1fr_200px_180px_140px]">
          <div className="relative"><Search className="absolute left-3 top-3 text-slate-400" size={18}/><input className="input pl-10" placeholder="Search products..." value={input} onChange={e => { const v=e.target.value; setInput(v); clearTimeout((window as any).__searchTimer); (window as any).__searchTimer=setTimeout(() => update({q:v,page:"1"}),400); }}/></div>
          <select className="input" value={category} onChange={e => update({category:e.target.value,page:"1"})}><option value="">All categories</option>{categories.map(c => <option key={c}>{c}</option>)}</select>
          <select className="input" value={`${sortBy}:${order}`} onChange={e => { const [s,o]=e.target.value.split(":"); update({sortBy:s,order:o,page:"1"}); }}><option value="id:asc">Default</option><option value="title:asc">Title A-Z</option><option value="title:desc">Title Z-A</option><option value="price:asc">Price Low-High</option><option value="price:desc">Price High-Low</option><option value="rating:desc">Rating High-Low</option></select>
          <button onClick={reset} className="btn-secondary inline-flex items-center justify-center gap-2"><RotateCcw size={16}/> Reset</button>
        </div>
        {q && category && <div className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">Filtering within “{category}” for “{q}”</div>}
      </div>
      {error && <div className="flex items-center justify-between rounded-xl bg-red-50 p-4 text-sm text-red-700"><span>{error}</span><button className="font-semibold underline" onClick={() => router.refresh()}>Retry</button></div>}
      {loading ? <Skeleton /> : products.length ? <><ProductTable products={products} onChanged={() => router.refresh()} /><div className="rounded-2xl border shadow-soft"><div className="bg-white px-4 py-3 text-sm text-slate-500">Showing {statusStart}–{statusEnd} of {total} products</div><Pagination page={page} totalPages={totalPages} onPage={p => update({page:String(p)})} limit={limit} onLimit={n => update({limit:String(n),page:"1"})}/></div></> : <div className="rounded-2xl border bg-white p-12 text-center shadow-soft"><Search className="mx-auto text-slate-300" size={42}/><h3 className="mt-4 font-semibold">No products found</h3><p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p><button onClick={reset} className="mt-5 btn-secondary">Reset Filters</button></div>}
    </div>
  </DashboardShell>;
}

function sortProducts(products: Product[], by: string, order: string) {
  return [...products].sort((a,b) => {
    const av = by === "title" ? a.title.toLowerCase() : Number(a[by as keyof Product] ?? 0);
    const bv = by === "title" ? b.title.toLowerCase() : Number(b[by as keyof Product] ?? 0);
    const cmp = av < bv ? -1 : av > bv ? 1 : 0; return order === "desc" ? -cmp : cmp;
  });
}
function Skeleton() { return <div className="space-y-3 rounded-2xl border bg-white p-5">{Array.from({length:8}).map((_,i)=><div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100"/>)}</div>; }