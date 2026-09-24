 "use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Product } from "@/types/product";
import { deleteProduct } from "@/services/productService";
import { getProductStore, setProductStore } from "@/lib/storage";

export default function DeleteModal({ product, onClose, onDeleted }: { product: Product; onClose: () => void; onDeleted: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function confirm() {
    setLoading(true); setError("");
    try {
      await deleteProduct(product.id);
      const store = getProductStore();
      if (!store.deleted.includes(product.id)) store.deleted.push(product.id);
      store.created = store.created.filter(p => p.id !== product.id);
      delete store.updated[product.id];
      setProductStore(store);
      onDeleted();
    } catch (e) { setError(e instanceof Error ? e.message : "Delete failed."); }
    finally { setLoading(false); }
  }
  return <Modal title="Delete product" onClose={onClose}><div className="p-5"><p className="text-slate-600">Are you sure you want to delete <strong>{product.title}</strong>?</p>{error && <p className="mt-3 text-sm text-red-600">{error}</p>}<div className="mt-6 flex justify-end gap-3"><button onClick={onClose} className="btn-secondary">Cancel</button><button disabled={loading} onClick={confirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading ? "Deleting..." : "Delete"}</button></div></div></Modal>;
}