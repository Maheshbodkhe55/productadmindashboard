 "use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Pencil, Star } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { getProductById } from "@/services/productService";
import { getProductStore } from "@/lib/storage";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { useParams } from "next/navigation";

export default function ProductDetailsPage() {
  const { id } = useParams<{id:string}>();
  const [product,setProduct] = useState<Product|null>(null), [error,setError]=useState(""), [image,setImage]=useState("");
  useEffect(() => { (async()=>{ try { const p=await getProductById(Number(id)); const s=getProductStore(); setProduct({...p,...(s.updated[p.id]||{})}); setImage(p.thumbnail||p.images?.[0]||""); } catch(e){setError(e instanceof Error?e.message:"Product not found.");} })(); }, [id]);
  if(error) return <DashboardShell><div className="mx-auto max-w-3xl rounded-2xl border bg-white p-12 text-center"><h2 className="text-xl font-bold">Product Not Found</h2><p className="mt-2 text-sm text-slate-500">{error}</p><Link href="/products" className="mt-5 inline-flex btn-primary">Back to Products</Link></div></DashboardShell>;
  if(!product) return <DashboardShell><div className="p-10 text-center">Loading...</div></DashboardShell>;
  const images=product.images?.length?product.images:[product.thumbnail].filter(Boolean) as string[];
  const savings=product.price*(product.discountPercentage||0)/100;
  return <DashboardShell><div className="mx-auto max-w-6xl space-y-5"><div className="flex items-center justify-between"><Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600"><ArrowLeft size={17}/> Back</Link><Link href={`/products/${product.id}/edit`} className="btn-secondary inline-flex items-center gap-2"><Pencil size={16}/> Edit</Link></div>
    <div className="grid gap-7 rounded-2xl border bg-white p-5 shadow-soft md:grid-cols-2 md:p-8"><div><div className="flex h-96 items-center justify-center rounded-2xl bg-slate-50 p-6"><Image src={image || "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg"} alt={product.title} width={500} height={400} className="max-h-full w-auto object-contain"/></div><div className="mt-3 flex gap-2 overflow-auto">{images.map((src,i)=><button key={src+i} onClick={()=>setImage(src)} className="rounded-lg border p-1"><Image src={src} alt="" width={70} height={70} className="h-16 w-16 rounded-md object-cover"/></button>)}</div></div>
    <div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">{product.category}</span><h2 className="mt-4 text-3xl font-bold">{product.title}</h2><div className="mt-3 flex items-center gap-2 text-sm"><Star size={17} fill="currentColor" className="text-amber-400"/> {product.rating?.toFixed(1)} · {product.stock} in stock</div><p className="mt-5 text-slate-600">{product.description}</p><div className="mt-6"><span className="text-3xl font-bold">{formatCurrency(product.price)}</span>{product.discountPercentage>0&&<span className="ml-3 rounded-full bg-emerald-50 px-2 py-1 text-sm text-emerald-700">{product.discountPercentage}% off · Save {formatCurrency(savings)}</span>}</div>
    <dl className="mt-7 grid grid-cols-2 gap-4 text-sm"><Info label="Brand" value={product.brand}/><Info label="SKU" value={product.sku}/><Info label="Warranty" value={product.warrantyInformation}/><Info label="Shipping" value={product.shippingInformation}/><Info label="Return policy" value={product.returnPolicy}/><Info label="Minimum order" value={String(product.minimumOrderQuantity||1)}/></dl></div></div>
    <section className="rounded-2xl border bg-white p-5 shadow-soft"><h3 className="text-lg font-bold">Reviews</h3><div className="mt-4 grid gap-4 md:grid-cols-2">{(product.reviews||[]).map((r,i)=><div key={i} className="rounded-xl bg-slate-50 p-4"><div className="flex justify-between"><b>{r.reviewerName}</b><span>⭐ {r.rating}</span></div><p className="mt-2 text-sm text-slate-600">{r.comment}</p><p className="mt-2 text-xs text-slate-400">{new Date(r.date).toLocaleDateString()}</p></div>)}</div></section>
  </div></DashboardShell>;
}
function Info({label,value}:{label:string;value?:string}){return <div><dt className="text-xs text-slate-400">{label}</dt><dd className="mt-1 font-medium">{value||"—"}</dd></div>}