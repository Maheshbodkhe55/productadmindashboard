"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  addProduct,
  getProductById,
  updateProduct,
} from "../../services/productService";

import {
  getLocalProduct,
  isLocallyDeleted,
} from "../../lib/productStore";

export default function ProductForm({
  id,
}: {
  id?: string;
}) {
  const router = useRouter();

  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    thumbnail: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // Load product for editing
  // =========================

  useEffect(() => {
    if (!id) {
      return;
    }

    async function loadProduct() {
      try {
        const numericId = Number(id);

        if (Number.isNaN(numericId)) {
          setError("Invalid product ID.");
          return;
        }

        // First check localStorage
        const localProduct =
          getLocalProduct(numericId);

        if (localProduct) {
          setForm({
            title: localProduct.title || "",
            description:
              localProduct.description || "",
            price: localProduct.price ?? "",
            stock: localProduct.stock ?? "",
            category: localProduct.category || "",
            thumbnail:
              localProduct.thumbnail || "",
          });

          return;
        }

        // If locally deleted, don't allow editing
        if (isLocallyDeleted(numericId)) {
          setError("Product not found.");
          return;
        }

        // Otherwise get it from DummyJSON
        const product =
          await getProductById(numericId);

        setForm({
          title: product.title || "",
          description:
            product.description || "",
          price: product.price ?? "",
          stock: product.stock ?? "",
          category: product.category || "",
          thumbnail:
            product.thumbnail || "",
        });
      } catch (error) {
        console.error(error);
        setError("Product not found.");
      }
    }

    loadProduct();
  }, [id]);

  // =========================
  // Input change
  // =========================

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous: any) => ({
      ...previous,
      [name]: value,
    }));
  }

  // =========================
  // Validation
  // =========================

  function validateForm() {
    if (!form.title.trim()) {
      return "Product title is required.";
    }

    if (!form.category.trim()) {
      return "Category is required.";
    }

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
      return "Enter a valid price.";
    }

    if (
      form.stock === "" ||
      Number(form.stock) < 0
    ) {
      return "Enter a valid stock.";
    }

    return "";
  }

  // =========================
  // Submit
  // =========================

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const productData = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category.trim(),
        thumbnail: form.thumbnail.trim(),
      };

      // =========================
      // EDIT PRODUCT
      // =========================

      if (id) {
        const numericId = Number(id);

        if (Number.isNaN(numericId)) {
          setError("Invalid product ID.");
          return;
        }

        await updateProduct(
          numericId,
          productData
        );

        router.push("/products");
        router.refresh();

        return;
      }

      // =========================
      // ADD PRODUCT
      // =========================

      await addProduct(productData);

      router.push("/products");
      router.refresh();
    } catch (error) {
      console.error(
        "Unable to save product:",
        error
      );

      setError(
        "Unable to save product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <form
        onSubmit={handleSubmit}
        className="card max-w-2xl mx-auto space-y-5"
      >
        <div>
          <h2 className="text-2xl font-bold">
            {id
              ? "Edit product"
              : "Add product"}
          </h2>

          <p className="muted mt-1">
            {id
              ? "Update the product information."
              : "Add a new product to your catalog."}
          </p>
        </div>

        {error && (
          <div className="border border-red-200 bg-red-50 text-red-600 rounded-lg p-3">
            {error}
          </div>
        )}

        {/* Title */}

        <label className="block">
          <span className="font-medium">
            Title *
          </span>

          <input
            className="input mt-1"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter product title"
          />
        </label>

        {/* Category */}

        <label className="block">
          <span className="font-medium">
            Category *
          </span>

          <input
            className="input mt-1"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Example: groceries"
          />
        </label>

        {/* Price */}

        <label className="block">
          <span className="font-medium">
            Price *
          </span>

          <input
            className="input mt-1"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="0"
          />
        </label>

        {/* Stock */}

        <label className="block">
          <span className="font-medium">
            Stock *
          </span>

          <input
            className="input mt-1"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={handleChange}
            placeholder="0"
          />
        </label>

        {/* Image */}

        <label className="block">
          <span className="font-medium">
            Image URL
          </span>

          <input
            className="input mt-1"
            name="thumbnail"
            value={form.thumbnail}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </label>

        {/* Description */}

        <label className="block">
          <span className="font-medium">
            Description
          </span>

          <textarea
            className="input mt-1"
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            placeholder="Enter product description"
          />
        </label>

        {/* Buttons */}

        <div className="flex gap-3">
          <button
            type="submit"
            className="btn primary"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : id
              ? "Update product"
              : "Add product"}
          </button>

          <button
            type="button"
            className="btn border"
            onClick={() =>
              router.push("/products")
            }
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}