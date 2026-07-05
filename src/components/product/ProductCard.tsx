"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useUIStore } from "@/store/useUIStore";
import { useState } from "react";

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    category: string;
    fabric: string;
    basePrice: number;
    rating: number;
    ratingCount: number;
    images: { url: string; order: number }[];
    variants: {
      id: string;
      sku: string;
      size: string;
      color: string;
      priceAdjustment: number;
      stock: number;
    }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const addToast = useUIStore((state) => state.addToast);
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const firstVariant = product.variants[0];
  const finalPrice = product.basePrice + (firstVariant?.priceAdjustment || 0);
  const primaryImage = product.images.find((img) => img.order === 0)?.url || product.images[0]?.url || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af";
  const hoverImage = product.images.find((img) => img.order === 1)?.url || primaryImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!firstVariant) {
      addToast("Out of stock", "error");
      return;
    }

    addToCart({
      variantId: firstVariant.id,
      productId: product.id,
      name: product.name,
      image: primaryImage,
      size: firstVariant.size,
      color: firstVariant.color,
      price: finalPrice,
      quantity: 1,
      stock: firstVariant.stock,
    });

    addToast(`Added "${product.name} - ${firstVariant.size.split(" (")[0]}" to your bag!`, "success");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(!wishlisted);
    addToast(
      wishlisted 
        ? `Removed "${product.name}" from your wishlist` 
        : `Added "${product.name}" to your wishlist`,
      "success"
    );
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl bg-alemah-cream/15 border border-alemah-sand/35 overflow-hidden transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Product Image Link Container */}
      <Link href={`/product/${product.id}`} className="block relative w-full pt-[115%] overflow-hidden bg-alemah-cream select-none cursor-pointer">
        <Image
          src={hovered ? hoverImage : primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          priority={product.id === "1"} // prioritize first card loads
        />

        {/* Floating Brand Badges */}
        {product.rating >= 4.7 && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-alemah-gold/90 text-white text-[10px] font-sans font-semibold uppercase tracking-wider shadow-sm">
            Top Rated
          </span>
        )}

        {/* Wishlist Trigger */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-background transition-colors cursor-pointer ${
            wishlisted ? "text-ios-red" : "text-alemah-taupe hover:text-alemah-espresso"
          }`}
          title="Add to Wishlist"
        >
          <Heart className="w-4 h-4 fill-current" style={{ fillOpacity: wishlisted ? 1 : 0 }} />
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute bottom-3 left-3 right-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
          <button
            onClick={handleQuickAdd}
            className="w-full h-10 rounded-full bg-background text-alemah-espresso hover:bg-alemah-red-600 hover:text-white font-sans text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md ios-active-scale transition-all duration-200 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Quick Add
          </button>
        </div>
      </Link>

      {/* Card Info details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-sans font-semibold text-alemah-taupe uppercase tracking-wider block mb-1">
            {product.category}
          </span>
          <Link href={`/product/${product.id}`} className="cursor-pointer">
            <h4 className="font-sans font-semibold text-sm text-alemah-espresso group-hover:text-alemah-red-600 transition-colors line-clamp-1">
              {product.name}
            </h4>
          </Link>
          <p className="font-sans text-[11px] text-alemah-taupe mt-1 line-clamp-1">
            {product.fabric}
          </p>
        </div>

        <div className="flex justify-between items-center mt-3 pt-3 border-t border-alemah-sand/20">
          <span className="font-sans font-bold text-sm text-alemah-espresso">
            ₹{finalPrice}
          </span>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-alemah-gold text-alemah-gold" />
            <span className="font-sans text-xs font-semibold text-alemah-espresso">
              {product.rating.toFixed(1)}
            </span>
            <span className="font-sans text-[10px] text-alemah-taupe font-medium">
              ({product.ratingCount})
            </span>
          </div>
        </div>

        {/* Mobile Quick Add Button */}
        <button
          onClick={handleQuickAdd}
          className="md:hidden mt-3 w-full h-9 rounded-full bg-alemah-red-600 text-white font-sans text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm ios-active-scale transition-colors cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Add to Bag
        </button>
      </div>
    </div>
  );
}
