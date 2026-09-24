import { ProductStore } from "@/types/product";
import { User } from "@/types/auth";
import type { Product } from "@/types/product";
import {
  applyLocalChanges,
  getLocalProduct,
  getLocalProductData,
  isLocallyDeleted,
  saveAddedProduct,
  saveDeletedProduct,
  saveUpdatedProduct,
} from "@/lib/productStore";

const AUTH_KEY = "product_admin_auth";

export function getStoredAuth(): { token: string; user: User } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(token: string, user: User) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ token, user }));
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_KEY);
}

const emptyStore: ProductStore = { created: [], updated: {}, deleted: [] };

export function getProductStore(): ProductStore {
  const data = getLocalProductData();
  return {
    created: data.added,
    updated: data.updated,
    deleted: data.deleted,
  };
}

export function setProductStore(store: ProductStore) {
  const next = {
    added: store.created,
    updated: store.updated,
    deleted: store.deleted,
  };

  localStorage.setItem("product-admin-local-data", JSON.stringify(next));
}

export function mergeLocalProducts(products: Product[]): Product[] {
  return applyLocalChanges(products);
}

export {
  applyLocalChanges,
  getLocalProduct,
  getLocalProductData,
  isLocallyDeleted,
  saveAddedProduct,
  saveDeletedProduct,
  saveUpdatedProduct,
};