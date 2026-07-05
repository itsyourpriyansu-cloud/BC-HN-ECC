import { db } from "@/lib/db";
import CategoryProductsList from "@/components/product/CategoryProductsList";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { category: "Bedsheets" },
    { category: "Cushion Covers" },
    { category: "Quilts & Comforters" },
    { category: "Curtains" },
    { category: "Table & Kitchen Linen" },
  ];
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const decodedCategory = decodeURIComponent(resolvedParams.category);

  // Validate categories
  const validCategories = [
    "Bedsheets",
    "Cushion Covers",
    "Quilts & Comforters",
    "Curtains",
    "Table & Kitchen Linen",
  ];

  if (!validCategories.includes(decodedCategory)) {
    notFound();
  }

  // Fetch products in this category
  const products = await db.product.findMany({
    where: { category: decodedCategory },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col gap-8 sm:gap-12 w-full">
      {/* Editorial Header */}
      <div className="border-b border-alemah-sand/30 pb-6 sm:pb-8">
        <span className="font-sans text-xs font-bold text-alemah-red-600 uppercase tracking-widest block mb-1">
          Shop Range
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-alemah-espresso">
          {decodedCategory}
        </h1>
        <p className="font-sans text-sm text-alemah-taupe mt-2">
          Discover Alemah&apos;s curated selection of premium {decodedCategory.toLowerCase()}, crafted with legacy weaving and styling details.
        </p>
      </div>

      {/* Filterable Products List */}
      <CategoryProductsList category={decodedCategory} products={products} />
    </div>
  );
}
