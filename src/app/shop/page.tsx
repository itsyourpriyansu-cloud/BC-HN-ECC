import { db } from "@/lib/db";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import Image from "next/image";

export default async function ShopPage() {
  const products = await db.product.findMany({
    include: {
      images: { orderBy: { order: "asc" } },
      variants: true,
    },
  });

  const categories = [
    {
      name: "Bedsheets",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
      href: "/shop/Bedsheets",
    },
    {
      name: "Cushion Covers",
      image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
      href: "/shop/Cushion Covers",
    },
    {
      name: "Quilts & Comforters",
      image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
      href: "/shop/Quilts & Comforters",
    },
    {
      name: "Curtains",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
      href: "/shop/Curtains",
    },
    {
      name: "Table & Kitchen Linen",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
      href: "/shop/Table & Kitchen Linen",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col gap-12 sm:gap-16 w-full">
      {/* Page Title */}
      <div className="text-center max-w-xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-alemah-espresso">
          The Collections
        </h1>
        <p className="font-sans text-sm text-alemah-taupe mt-2.5">
          Carefully woven textiles using organic materials and legacy craft techniques.
        </p>
      </div>

      {/* Categories Horizontal Banner Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="group relative h-40 rounded-xl overflow-hidden border border-alemah-sand/30 flex items-center justify-center select-none cursor-pointer"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-cover transition-transform duration-750 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/55 group-hover:bg-black/60 transition-colors" />
            <span className="z-10 font-serif font-bold text-base text-white text-center px-2 group-hover:underline">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>

      {/* All Products Grid Section */}
      <div className="flex flex-col gap-6 pt-6 border-t border-alemah-sand/30">
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-alemah-espresso">
          All Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod as any} />
          ))}
        </div>
      </div>
    </div>
  );
}
