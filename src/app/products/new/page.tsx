 "use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import ProductForm from "@/components/products/ProductForm";
import { getCategories } from "@/services/productService";

export default function NewProductPage() {
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => { getCategories().then(setCategories).catch(() => {}); }, []);
  return <DashboardShell><div className="mx-auto max-w-4xl space-y-5"><div><h2 className="text-2xl font-bold">Add Product</h2><p className="text-sm text-slate-500">Create a new catalog item</p></div><ProductForm categories={categories}/></div></DashboardShell>;
}