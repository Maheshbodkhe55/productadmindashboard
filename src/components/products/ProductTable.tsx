 "use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import DeleteModal from "./DeleteModal";

export default function ProductTable({ products, onChanged }: { products: Product[]; onChanged: () => void }) {
  const [deleting, setDeleting] = useState<Product | null>(null);
  return <>
    <div className="hidden overflow-hidden rounded-2xl border bg-white shadow-soft md:block">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Product</th><th>Category</th><th>Price</th><th>Rating</th><th>Stock</th><th className="pr-5">Actions</th></tr></thead>
        <tbody className="divide-y">
          {products.map(p => <tr key={p.id} className="hover:bg-slate-50">
            <td className="px-5 py-4"><div className="flex items-center gap-3"><Image src={p.thumbnail || "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg"} alt="" width={48} height={48} className="h-12 w-12 rounded-lg object-cover" /><div><p className="font-semibold text-slate-900">{p.title}</p><p className="text-xs text-slate-500">#{p.id}</p></div></div></td>
            <td><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs">{p.category}</span></td><td className="font-semibold">{formatCurrency(p.price)}</td><td>⭐ {p.rating?.toFixed(1) ?? "—"}</td><td><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${p.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}</span></td>
            <td className="pr-5"><div className="flex gap-1"><Action href={`/products/${p.id}`} icon={<Eye size={16} />} /><Action href={`/products/${p.id}/edit`} icon={<Pencil size={16} />} /><button onClick={() => setDeleting(p)} className="icon-btn text-red-600"><Trash2 size={16} /></button></div></td>
          </tr>)}
        </tbody>
      </table>
    </div>
    <div className="grid gap-4 md:hidden">{products.map(p => <div key={p.id} className="rounded-2xl border bg-white p-4 shadow-soft"><div className="flex gap-3"><Image src={p.thumbnail || "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg"} alt="" width={80} height={80} className="h-20 w-20 rounded-xl object-cover" /><div className="min-w-0"><h3 className="truncate font-semibold">{p.title}</h3><p className="mt-1 text-sm text-slate-500">{p.category}</p><p className="mt-2 font-bold">{formatCurrency(p.price)}</p><p className="text-xs text-slate-500">⭐ {p.rating?.toFixed(1) ?? "—"} · {p.stock} stock</p></div></div><div className="mt-4 flex gap-2"><Action href={`/products/${p.id}`} icon={<Eye size={16} />} /><Action href={`/products/${p.id}/edit`} icon={<Pencil size={16} />} /><button onClick={() => setDeleting(p)} className="icon-btn text-red-600"><Trash2 size={16} /></button></div></div>)}</div>
    {deleting && <DeleteModal product={deleting} onClose={() => setDeleting(null)} onDeleted={() => { setDeleting(null); onChanged(); }} />}
  </>;
}

function Action({ href, icon }: { href: string; icon: React.ReactNode }) { return <Link href={href} className="icon-btn">{icon}</Link>; }