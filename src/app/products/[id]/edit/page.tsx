 "use client";

 import { useParams } from "next/navigation";
 import DashboardShell from "@/components/layout/DashboardShell";
 import ProductForm from "@/components/products/ProductForm";

 export default function EditProductPage() {
   const { id } = useParams<{ id: string }>();

   return (
     <DashboardShell>
       <div className="mx-auto max-w-4xl space-y-5">
         <div>
           <h2 className="text-2xl font-bold">Edit Product</h2>
           <p className="text-sm text-slate-500">
             Update product information
           </p>
         </div>
         <ProductForm id={id} />
       </div>
     </DashboardShell>
   );
 }