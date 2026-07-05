"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Truck, Heart, Minus, Plus, ShoppingBag, ChevronDown, ChevronUp, CheckCircle, AlertCircle } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useUIStore } from "@/store/useUIStore";
import ProductCard from "@/components/product/ProductCard";

interface ProductDetailWrapperProps {
  product: {
    id: string;
    name: string;
    description: string;
    category: string;
    fabric: string;
    threadCount: number | null;
    gsm: number | null;
    careInstructions: string;
    basePrice: number;
    rating: number;
    ratingCount: number;
    images: { id?: string; url: string; order: number }[];
    variants: {
      id: string;
      sku: string;
      size: string;
      color: string;
      colorCode: string;
      stock: number;
      priceAdjustment: number;
    }[];
  };
  crossSells: any[];
}

export default function ProductDetailWrapper({ product, crossSells }: ProductDetailWrapperProps) {
  const { addToCart } = useCart();
  const addToast = useUIStore((state) => state.addToast);
  const setCartOpen = useUIStore((state) => state.setCartOpen);

  // local states
  const [activeImage, setActiveImage] = useState(
    product.images.find((img) => img.order === 0)?.url || product.images[0]?.url
  );
  
  // Group variants by color and size
  const colors = Array.from(new Set(product.variants.map((v) => v.color)));
  const sizes = Array.from(new Set(product.variants.map((v) => v.size)));

  const [selectedColor, setSelectedColor] = useState(colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "success" | "error">("idle");
  const [pincodeMessage, setPincodeMessage] = useState("");
  const [wishlisted, setWishlisted] = useState(false);

  // Accordion state
  const [specOpen, setSpecOpen] = useState(true);
  const [careOpen, setCareOpen] = useState(false);

  // Find selected variant record
  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  ) || product.variants[0];

  const finalPrice = product.basePrice + (selectedVariant?.priceAdjustment || 0);

  // PWA product-views engagement tracker
  useEffect(() => {
    if (typeof window !== "undefined") {
      const views = parseInt(localStorage.getItem("alemah-product-views") || "0", 10);
      localStorage.setItem("alemah-product-views", (views + 1).toString());
      window.dispatchEvent(new Event("alemah-product-viewed"));
    }
  }, [product.id]);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      addToast("Out of stock", "error");
      return;
    }

    addToCart({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      image: product.images[0]?.url || "",
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: finalPrice,
      quantity: quantity,
      stock: selectedVariant.stock,
    });

    addToast(`Added ${quantity}x "${product.name}" to bag!`, "success");
    setCartOpen(true);
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || isNaN(Number(pincode))) {
      setPincodeStatus("error");
      setPincodeMessage("Please enter a valid 6-digit PIN code.");
      return;
    }

    // Mock India pincode estimation logic
    const firstDigit = pincode[0];
    if (firstDigit === "0" || firstDigit === "9") {
      setPincodeStatus("error");
      setPincodeMessage("Standard delivery is not available for this pincode.");
    } else {
      setPincodeStatus("success");
      const deliveryDays = firstDigit === "5" || firstDigit === "6" ? "2-3 days" : "4-6 days";
      setPincodeMessage(`Express Delivery eligible. Delivery within ${deliveryDays}. COD eligible.`);
    }
  };

  const handleWishlist = () => {
    setWishlisted(!wishlisted);
    addToast(
      wishlisted 
        ? `Removed "${product.name}" from your wishlist` 
        : `Added "${product.name}" to your wishlist`,
      "success"
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col gap-16 sm:gap-24 w-full">
      {/* Dynamic PDP layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        
        {/* LEFT COLUMN: Gallery */}
        <div className="flex flex-col gap-4 w-full">
          {/* Main Display Photo */}
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-alemah-cream border border-alemah-sand/40 shadow-sm select-none">
            {activeImage && (
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-all duration-300 hover:scale-105"
              />
            )}
          </div>

          {/* Thumbnails Row */}
          <div className="flex gap-3 overflow-x-auto py-1">
            {product.images.map((img) => (
              <button
                key={img.url}
                onClick={() => setActiveImage(img.url)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden bg-alemah-cream shrink-0 border-2 transition-all cursor-pointer ${
                  activeImage === img.url ? "border-alemah-red-600 shadow-sm" : "border-transparent opacity-85 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt={product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Product Configurator */}
        <div className="flex flex-col gap-6 font-sans">
          
          {/* Title and Ratings */}
          <div>
            <span className="text-xs font-bold text-alemah-red-600 uppercase tracking-widest block mb-1">
              {product.category}
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-alemah-espresso leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mt-3">
              {/* Stars */}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-alemah-gold text-alemah-gold" />
                <span className="text-sm font-bold text-alemah-espresso">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-alemah-taupe font-medium">({product.ratingCount} reviews)</span>
              </div>
              <span className="text-alemah-sand">|</span>
              <span className="text-xs text-ios-green font-semibold bg-ios-green/10 px-2.5 py-1 rounded-full">
                In Stock ({selectedVariant?.stock || 0} units left)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="bg-alemah-cream/25 border border-alemah-sand/30 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-alemah-taupe font-bold uppercase tracking-wider block">
                Total Price (Inc. Taxes)
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-alemah-red-600 block mt-0.5">
                ₹{finalPrice}
              </span>
            </div>
            <div className="text-right text-xs text-alemah-taupe">
              <span className="block font-medium">Fabric: {product.fabric}</span>
              {product.threadCount && <span className="block">Thread Count: {product.threadCount} TC</span>}
              {product.gsm && <span className="block">GSM: {product.gsm} gsm</span>}
            </div>
          </div>

          {/* Color Selector */}
          {colors.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-alemah-espresso uppercase tracking-wider mb-2.5">
                Select Color: <span className="text-alemah-taupe font-medium">{selectedColor}</span>
              </h4>
              <div className="flex gap-3">
                {colors.map((color) => {
                  const variant = product.variants.find((v) => v.color === color);
                  return (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        // find first matching image of variant color or stay
                      }}
                      className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ios-active-scale cursor-pointer ${
                        selectedColor === color ? "border-alemah-red-600 ring-2 ring-alemah-red-100 shadow-sm" : "border-alemah-sand"
                      }`}
                      style={{ backgroundColor: variant?.colorCode || "#ffffff" }}
                      title={color}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {sizes.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-alemah-espresso uppercase tracking-wider mb-2.5">
                Select Size: <span className="text-alemah-taupe font-medium">{selectedSize}</span>
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 px-4 rounded-xl border text-xs font-semibold ios-active-scale transition-all cursor-pointer ${
                      selectedSize === size
                        ? "border-alemah-red-600 text-alemah-red-600 bg-alemah-red-050"
                        : "border-alemah-sand text-alemah-taupe hover:text-alemah-espresso hover:bg-alemah-cream/30 bg-background"
                    }`}
                  >
                    {size.split(" (")[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="flex gap-4 items-center">
            {/* Stepper */}
            <div className="flex items-center border border-alemah-sand rounded-xl h-12 bg-background px-1.5 shrink-0">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="p-2 text-alemah-espresso hover:bg-alemah-cream rounded-lg transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold px-4 min-w-[36px] text-center text-alemah-espresso">
                {quantity}
              </span>
              <button
                onClick={() => quantity < (selectedVariant?.stock || 10) && setQuantity(quantity + 1)}
                className="p-2 text-alemah-espresso hover:bg-alemah-cream rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Bag CTA */}
            <button
              onClick={handleAddToCart}
              className="flex-1 h-12 rounded-full bg-alemah-red-600 hover:bg-alemah-red-700 text-white font-sans text-sm font-semibold flex items-center justify-center gap-2 ios-active-scale transition-colors shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Bag
            </button>

            {/* Heart Wishlist Toggle */}
            <button
              onClick={handleWishlist}
              className={`w-12 h-12 rounded-full border border-alemah-sand flex items-center justify-center ios-active-scale hover:bg-alemah-cream/30 transition-all cursor-pointer ${
                wishlisted ? "text-ios-red border-ios-red/40 bg-ios-red/5" : "text-alemah-taupe"
              }`}
            >
              <Heart className="w-5 h-5 fill-current" style={{ fillOpacity: wishlisted ? 1 : 0 }} />
            </button>
          </div>

          {/* Delivery Estimator Pin Check */}
          <div className="border border-alemah-sand/40 rounded-2xl p-4 bg-alemah-cream/10">
            <h4 className="text-xs font-bold text-alemah-espresso uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-alemah-red-600" />
              Delivery Availability Estimator
            </h4>
            
            <form onSubmit={handlePincodeCheck} className="flex gap-2.5">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit PIN code"
                className="flex-1 h-10 px-3.5 rounded-xl border border-alemah-sand bg-background text-xs focus:outline-none focus:border-alemah-red-600 focus:ring-1 focus:ring-alemah-red-600"
              />
              <button
                type="submit"
                className="h-10 px-4 rounded-xl border border-alemah-espresso text-alemah-espresso hover:bg-alemah-espresso hover:text-white font-sans text-xs font-semibold transition-colors cursor-pointer"
              >
                Check
              </button>
            </form>

            {pincodeStatus !== "idle" && (
              <div
                className={`mt-3 flex items-start gap-2 text-xs font-sans p-2 rounded-lg border ${
                  pincodeStatus === "success"
                    ? "bg-ios-green/10 border-ios-green/20 text-ios-green"
                    : "bg-ios-red/10 border-ios-red/20 text-ios-red"
                }`}
              >
                {pincodeStatus === "success" ? (
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{pincodeMessage}</span>
              </div>
            )}
          </div>

          {/* Accordion Specs & Guides */}
          <div className="border border-alemah-sand/30 rounded-2xl overflow-hidden bg-background shadow-sm">
            {/* Spec Button */}
            <button
              onClick={() => setSpecOpen(!specOpen)}
              className="w-full p-4 border-b border-alemah-sand/30 flex justify-between items-center text-left text-sm font-bold text-alemah-espresso hover:bg-alemah-cream/15 transition-colors cursor-pointer"
            >
              Craftsmanship Details
              {specOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {specOpen && (
              <div className="p-4 font-sans text-xs text-alemah-taupe leading-relaxed bg-alemah-cream/10 flex flex-col gap-2">
                <p>{product.description}</p>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 border-t border-alemah-sand/20 pt-3.5 mt-2.5 font-medium text-alemah-espresso">
                  <div>Fabric Weight: <span className="font-semibold text-alemah-red-600">{product.gsm || "N/A"} GSM</span></div>
                  {product.threadCount && <div>Weave Count: <span className="font-semibold text-alemah-red-600">{product.threadCount} TC</span></div>}
                  <div>Material Source: <span className="font-semibold text-alemah-red-600">Organic Cultivated</span></div>
                  <div>Origin: <span className="font-semibold text-alemah-red-600">Handloom India</span></div>
                </div>
              </div>
            )}

            {/* Care Guide Button */}
            <button
              onClick={() => setCareOpen(!careOpen)}
              className="w-full p-4 flex justify-between items-center text-left text-sm font-bold text-alemah-espresso hover:bg-alemah-cream/15 transition-colors cursor-pointer"
            >
              Wash & Care Guide
              {careOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {careOpen && (
              <div className="p-4 font-sans text-xs text-alemah-taupe leading-relaxed bg-alemah-cream/10 flex flex-col gap-1 border-t border-alemah-sand/30">
                <p className="font-semibold text-alemah-espresso mb-1">Recommended Instructions:</p>
                <p>{product.careInstructions}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* COMPLETE THE SET - Cross-Sells Section */}
      {crossSells.length > 0 && (
        <section className="border-t border-alemah-sand/30 pt-16">
          <div className="flex flex-col gap-2 mb-10 text-center sm:text-left">
            <span className="font-sans text-xs font-bold text-alemah-red-600 uppercase tracking-widest">
              Style Coordination
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-alemah-espresso">
              Complete the Set
            </h3>
            <p className="font-sans text-xs text-alemah-taupe max-w-md">
              Pair your select item with these matching collections to form an integrated editorial textile design.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {crossSells.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* CUSTOMERS REVIEW SECTION */}
      <section className="border-t border-alemah-sand/30 pt-16">
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between mb-10">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-alemah-espresso">
              Customer Reviews
            </h3>
            <p className="font-sans text-xs text-alemah-taupe mt-1">
              Verified buying feedback from marketplace orders and our store.
            </p>
          </div>

          {/* Aggregate Rating Banner */}
          <div className="bg-alemah-cream border border-alemah-sand p-5 rounded-2xl shadow-sm text-center md:text-left flex items-center gap-5 w-full md:w-auto">
            <div className="w-14 h-14 rounded-full bg-alemah-red-600 text-white font-sans text-xl font-bold flex items-center justify-center shadow-sm shrink-0">
              {product.rating.toFixed(1)}
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-alemah-gold text-alemah-gold" />
                ))}
              </div>
              <p className="font-sans text-[11px] font-semibold text-alemah-espresso mt-1 uppercase tracking-wider">
                Overall score out of {product.ratingCount} submissions
              </p>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="flex flex-col gap-4">
          <div className="bg-alemah-cream/15 border border-alemah-sand/30 p-5 rounded-2xl flex flex-col gap-3 font-sans text-sm">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-bold text-alemah-espresso">Priyansu Kumar</h5>
                <div className="flex items-center gap-1 mt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3 fill-alemah-gold text-alemah-gold" />
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-alemah-taupe font-semibold">05 July 2026</span>
            </div>
            <p className="text-alemah-taupe leading-relaxed text-xs">
              Absolutely outstanding quality bedsheet. The thread count feels incredibly premium, with a satisfying weight. It's thick, crisp, and breathes beautifully. It stands out in comparison to general marketplace listings.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
