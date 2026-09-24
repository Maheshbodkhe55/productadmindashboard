 "use client";

 import DashboardShell from "@/components/layout/DashboardShell";
 import ProductForm from "@/components/products/ProductForm";

 export default function NewProductPage() {
   return (
     <DashboardShell>
       <div className="mx-auto max-w-4xl space-y-5">
         <div>
           <h2 className="text-2xl font-bold">Add Product</h2>
           <p className="text-sm text-slate-500">
             Create a new catalog item
           </p>
         </div>
         <ProductForm />
       </div>
     </DashboardShell>
   );
 }