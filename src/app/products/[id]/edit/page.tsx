 "use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import ProductForm from "@/components/products/ProductForm";
import { getCategories, getProductById } from "@/services/productService";
import { Product } from "@/types/product";
import { getProductStore } from "@/lib/storage";

export default function EditProductPage() {
  const { id } = useParams<{id:string}>();
  const [product,setProduct]=useState<Product|null>(null),[categories,setCategories]=useState<string[]>([]);
  useEffect(()=>{Promise.all([getProductById(Number(id)),getCategories()]).then(([p,c])=>{const s=getProductStore();setProduct({...p,...(s.updated[p.id]||{})});setCategories(c);}).catch(()=>{});},[id]);
  return <DashboardShell><div className="mx-auto max-w-4xl space-y-5"><div><h2 className="text-2xl font-bold">Edit Product</h2><p className="text-sm text-slate-500">Update product information</p></div>{product?<ProductForm product={product} categories={categories}/>:<div className="rounded-2xl border bg-white p-10 text-center">Loading...</div>}</div></DashboardShell>;
}