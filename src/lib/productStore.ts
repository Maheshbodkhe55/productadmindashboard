"use client";

const STORAGE_KEY = "product-admin-local-data";

export interface LocalProductData {
  added: any[];
  updated: Record<string, any>;
  deleted: number[];
}

const EMPTY_DATA: LocalProductData = {
  added: [],
  updated: {},
  deleted: [],
};

// Get local CRUD data
export function getLocalProductData(): LocalProductData {
  if (typeof window === "undefined") {
    return EMPTY_DATA;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return EMPTY_DATA;
    }

    const parsed = JSON.parse(stored);

    return {
      added: Array.isArray(parsed.added) ? parsed.added : [],
      updated:
        parsed.updated && typeof parsed.updated === "object"
          ? parsed.updated
          : {},
      deleted: Array.isArray(parsed.deleted)
        ? parsed.deleted.map(Number)
        : [],
    };
  } catch (error) {
    console.error("Failed to read local product data:", error);

    return EMPTY_DATA;
  }
}

// Save local CRUD data
function saveLocalProductData(data: LocalProductData) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
}

// Save newly added product
export function saveAddedProduct(product: any) {
  const data = getLocalProductData();

  // Avoid duplicates
  const exists = data.added.some(
    (item) => Number(item.id) === Number(product.id)
  );

  if (!exists) {
    data.added.push(product);
  }

  // If it was previously deleted, remove that deleted marker
  data.deleted = data.deleted.filter(
    (id) => Number(id) !== Number(product.id)
  );

  saveLocalProductData(data);
}

// Save updated product
export function saveUpdatedProduct(
  id: string | number,
  product: any
) {
  const data = getLocalProductData();

  const numericId = Number(id);

  // If it is a locally added product,
  // update it inside the added array.
  const addedIndex = data.added.findIndex(
    (item) => Number(item.id) === numericId
  );

  if (addedIndex !== -1) {
    data.added[addedIndex] = {
      ...data.added[addedIndex],
      ...product,
      id: numericId,
    };
  } else {
    // Otherwise store it as an override
    data.updated[String(numericId)] = {
      ...data.updated[String(numericId)],
      ...product,
      id: numericId,
    };
  }

  // If product was marked deleted, restore it
  data.deleted = data.deleted.filter(
    (deletedId) => Number(deletedId) !== numericId
  );

  saveLocalProductData(data);
}

// Save deleted product ID
export function saveDeletedProduct(
  id: string | number
) {
  const data = getLocalProductData();

  const numericId = Number(id);

  // Remove from locally added products
  data.added = data.added.filter(
    (product) => Number(product.id) !== numericId
  );

  // Remove any local update
  delete data.updated[String(numericId)];

  // Add to deleted list
  if (!data.deleted.includes(numericId)) {
    data.deleted.push(numericId);
  }

  saveLocalProductData(data);
}

// Apply local changes to products received from API
export function applyLocalChanges(products: any[]) {
  const data = getLocalProductData();

  // Deleted products should disappear
  const filteredProducts = products.filter(
    (product) =>
      !data.deleted.includes(Number(product.id))
  );

  // Apply edits
  const updatedProducts = filteredProducts.map(
    (product) => {
      const updated =
        data.updated[String(product.id)];

      if (!updated) {
        return product;
      }

      return {
        ...product,
        ...updated,
      };
    }
  );

  // Add locally created products
  const addedProducts = data.added.filter(
    (product) =>
      !data.deleted.includes(Number(product.id))
  );

  return [
    ...updatedProducts,
    ...addedProducts,
  ];
}

// Get a locally stored product by ID
export function getLocalProduct(
  id: string | number
) {
  const data = getLocalProductData();

  const numericId = Number(id);

  // Deleted product does not exist
  if (data.deleted.includes(numericId)) {
    return null;
  }

  // Check locally added product
  const addedProduct = data.added.find(
    (product) => Number(product.id) === numericId
  );

  if (addedProduct) {
    return addedProduct;
  }

  // Check updated product
  const updatedProduct =
    data.updated[String(numericId)];

  if (updatedProduct) {
    return updatedProduct;
  }

  return null;
}

// Check whether product was locally deleted
export function isLocallyDeleted(
  id: string | number
) {
  const data = getLocalProductData();

  return data.deleted.includes(Number(id));
}   