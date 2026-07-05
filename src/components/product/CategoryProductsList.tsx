"use client";

import { useState } from "react";
import ProductCard, { ProductCardProps } from "@/components/product/ProductCard";
import { useUIStore } from "@/store/useUIStore";
import { SlidersHorizontal, ArrowUpDown, X, Search, Check } from "lucide-react";

interface CategoryProductsListProps {
  category: string;
  products: ProductCardProps["product"][];
}

export default function CategoryProductsList({
  category,
  products,
}: CategoryProductsListProps) {
  const filterOpen = useUIStore((state) => state.filterOpen);
  const setFilterOpen = useUIStore((state) => state.setFilterOpen);

  const [selectedFabric, setSelectedFabric] = useState<string>("All");
  const [sortOption, setSortOption] = useState<string>("default");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract unique fabrics in this category for filtering options
  const fabrics = ["All", ...Array.from(new Set(products.map((p) => {
    if (p.fabric.toLowerCase().includes("cotton")) return "Cotton";
    if (p.fabric.toLowerCase().includes("linen")) return "Linen";
    if (p.fabric.toLowerCase().includes("velvet")) return "Velvet";
    if (p.fabric.toLowerCase().includes("mulmul")) return "Mulmul Cotton";
    return p.fabric;
  })))];

  // Filtering Logic
  const filteredProducts = products.filter((product) => {
    // A. Fabric Match
    let fabricMatch = true;
    if (selectedFabric !== "All") {
      fabricMatch = product.fabric.toLowerCase().includes(selectedFabric.toLowerCase());
    }
    // B. Search Match
    const searchMatch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.fabric.toLowerCase().includes(searchQuery.toLowerCase());

    return fabricMatch && searchMatch;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aPrice = a.basePrice + (a.variants[0]?.priceAdjustment || 0);
    const bPrice = b.basePrice + (b.variants[0]?.priceAdjustment || 0);

    if (sortOption === "price-asc") return aPrice - bPrice;
    if (sortOption === "price-desc") return bPrice - aPrice;
    if (sortOption === "rating") return b.rating - a.rating;
    return 0; // default sort
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Search & Mobile Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-alemah-cream/20 p-4 rounded-2xl border border-alemah-sand/30">
        
        {/* Search Input */}
        <div className="relative flex items-center w-full sm:max-w-xs">
          <Search className="absolute left-3 w-4 h-4 text-alemah-taupe" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-alemah-sand bg-background text-sm font-sans focus:outline-none focus:border-alemah-red-600 focus:ring-1 focus:ring-alemah-red-600"
          />
        </div>

        {/* Filter Controls Actions */}
        <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-start">
          <span className="font-sans text-xs text-alemah-taupe font-medium">
            {sortedProducts.length} items found
          </span>

          <div className="flex items-center gap-2">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setFilterOpen(true)}
              className="lg:hidden h-10 px-4 rounded-xl border border-alemah-sand hover:bg-alemah-cream/40 font-sans text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center h-10 border border-alemah-sand rounded-xl bg-background px-3 gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-alemah-taupe" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent font-sans text-xs font-semibold text-alemah-espresso outline-none cursor-pointer pr-1"
              >
                <option value="default">Default Sort</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:flex flex-col gap-6 w-56 shrink-0 font-sans">
          <div>
            <h4 className="font-serif font-bold text-base text-alemah-espresso mb-3">Fabric</h4>
            <div className="flex flex-col gap-2.5">
              {fabrics.map((fabric) => (
                <button
                  key={fabric}
                  onClick={() => setSelectedFabric(fabric)}
                  className={`flex items-center justify-between text-left text-xs font-medium py-1 px-2 rounded-lg cursor-pointer ${
                    selectedFabric === fabric
                      ? "text-alemah-red-600 bg-alemah-red-100/50"
                      : "text-alemah-taupe hover:text-alemah-espresso hover:bg-alemah-cream/30"
                  }`}
                >
                  {fabric}
                  {selectedFabric === fabric && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <div className="flex-1">
          {sortedProducts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-alemah-cream/10 border border-dashed border-alemah-sand/60 rounded-2xl">
              <p className="font-serif text-lg font-bold text-alemah-espresso">No items found</p>
              <p className="font-sans text-xs text-alemah-taupe mt-1 max-w-[280px]">
                Try adjusting your filters or search keywords to explore other Alemah textiles.
              </p>
              <button
                onClick={() => {
                  setSelectedFabric("All");
                  setSearchQuery("");
                }}
                className="mt-4 h-9 px-5 bg-alemah-red-600 hover:bg-alemah-red-700 text-white font-sans text-xs font-semibold rounded-full cursor-pointer transition-colors shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM DRAWER FILTER SHEET */}
      {filterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center lg:hidden animate-fade-in"
          onClick={() => setFilterOpen(false)}
        >
          <div
            className="w-full bg-background rounded-t-[24px] border-t border-alemah-sand/40 p-6 flex flex-col gap-5 shadow-2xl animate-slide-up textile-pattern max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* iOS slider bar */}
            <div className="w-12 h-1 bg-alemah-sand/60 rounded-full mx-auto mb-2" onClick={() => setFilterOpen(false)} />

            <div className="flex justify-between items-center pb-3 border-b border-alemah-sand/30">
              <h3 className="font-serif text-lg font-bold text-alemah-espresso flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-alemah-red-600" />
                Filters
              </h3>
              <button
                onClick={() => setFilterOpen(false)}
                className="p-1 text-alemah-espresso hover:bg-alemah-sand/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h4 className="font-serif font-bold text-sm text-alemah-espresso mb-3 pl-1">Filter by Fabric</h4>
              <div className="grid grid-cols-2 gap-2">
                {fabrics.map((fabric) => (
                  <button
                    key={fabric}
                    onClick={() => {
                      setSelectedFabric(fabric);
                      setFilterOpen(false);
                    }}
                    className={`h-10 px-3.5 rounded-xl border text-left font-sans text-xs font-semibold flex items-center justify-between ios-active-scale transition-all ${
                      selectedFabric === fabric
                        ? "border-alemah-red-600 text-alemah-red-600 bg-alemah-red-050"
                        : "border-alemah-sand/60 text-alemah-taupe bg-background"
                    }`}
                  >
                    {fabric}
                    {selectedFabric === fabric && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setFilterOpen(false)}
              className="w-full h-11 bg-alemah-red-600 hover:bg-alemah-red-700 text-white font-sans text-xs font-semibold rounded-full cursor-pointer transition-colors shadow-sm mt-3"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
