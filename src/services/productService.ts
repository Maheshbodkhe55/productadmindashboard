import { api } from "./api";
import {
  Product,
  ProductListResponse,
} from "@/types/product";

import {
  saveAddedProduct,
  saveUpdatedProduct,
  saveDeletedProduct,
  getLocalProduct,
  isLocallyDeleted,
} from "@/lib/productStore";

export async function getProducts(params: {
  limit: number;
  skip: number;
}) {
  const { data } =
    await api.get<ProductListResponse>("/products", {
      params,
    });

  return data;
}

export async function searchProducts(
  params: {
    q: string;
    limit: number;
    skip: number;
  },
  signal?: AbortSignal
) {
  const { data } =
    await api.get<ProductListResponse>(
      "/products/search",
      {
        params,
        signal,
      }
    );

  return data;
}

export async function getCategories(): Promise<
  string[]
> {
  const { data } =
    await api.get<
      Array<{
        slug: string;
        name: string;
        url: string;
      }>
    >("/products/categories");

  return data.map((x) => x.slug);
}

export async function getProductsByCategory(
  category: string,
  params: {
    limit: number;
    skip: number;
  }
) {
  const { data } =
    await api.get<ProductListResponse>(
      `/products/category/${encodeURIComponent(
        category
      )}`,
      {
        params,
      }
    );

  return data;
}

/**
 * Get a product by ID.
 *
 * First checks localStorage because products created
 * locally do not really exist on DummyJSON.
 */
export async function getProductById(
  id: number
) {
  const numericId = Number(id);

  // Check whether this product was locally deleted.
  if (isLocallyDeleted(numericId)) {
    throw new Error(
      `Product with id '${numericId}' not found`
    );
  }

  // Check locally added / locally updated product.
  const localProduct =
    getLocalProduct(numericId);

  if (localProduct) {
    try {
      // For an updated remote product, localProduct
      // only contains the override fields.
      const { data } =
        await api.get<Product>(
          `/products/${numericId}`
        );

      return {
        ...data,
        ...localProduct,
      };
    } catch {
      // If it doesn't exist remotely, it is a
      // locally-created product.
      return localProduct as Product;
    }
  }

  // Normal DummyJSON product.
  const { data } =
    await api.get<Product>(
      `/products/${numericId}`
    );

  return data;
}

/**
 * ADD PRODUCT
 *
 * DummyJSON returns a simulated product.
 * We save that returned product locally so it
 * survives refresh.
 */
export async function addProduct(
  payload: Partial<Product>
) {
  const { data } =
    await api.post<Product>(
      "/products/add",
      payload
    );

  saveAddedProduct(data);

  return data;
}

/**
 * UPDATE PRODUCT
 *
 * We call DummyJSON first.
 * Then save the update locally.
 */
export async function updateProduct(
  id: number,
  payload: Partial<Product>
) {
  let result: Product;

  try {
    const { data } =
      await api.put<Product>(
        `/products/${id}`,
        payload
      );

    result = data;
  } catch (error) {
    /*
     * A locally-created product does not really exist
     * on DummyJSON, so PUT may return 404.
     *
     * We still allow the edit locally.
     */
    const localProduct =
      getLocalProduct(id);

    if (!localProduct) {
      throw error;
    }

    result = {
      ...localProduct,
      ...payload,
      id,
    } as Product;
  }

  saveUpdatedProduct(id, result);

  return result;
}

/**
 * DELETE PRODUCT
 *
 * IMPORTANT:
 * DummyJSON may return 404 for locally-created
 * products such as ID 195.
 *
 * We still save the deletion locally.
 */
export async function deleteProduct(
  id: number
) {
  let apiResult: Product | null = null;

  try {
    const { data } =
      await api.delete<Product>(
        `/products/${id}`
      );

    apiResult = data;
  } catch (error: any) {
    /*
     * If the product was created locally,
     * DummyJSON may return 404.
     *
     * This is NOT a reason to stop the local
     * delete operation.
     */
    const localProduct =
      getLocalProduct(id);

    if (!localProduct) {
      throw error;
    }
  }

  // Always persist deletion locally.
  saveDeletedProduct(id);

  return (
    apiResult ?? {
      id,
      isDeleted: true,
    }
  );
}