import { db } from "@/lib/db";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import HeroCarousel from "@/components/home/HeroCarousel";

export default async function HomePage() {
  // Fetch featured items
  const featuredProducts = await db.product.findMany({
    where: { isFeatured: true },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: true,
    },
    take: 8,
  });

  const categories = [
    {
      name: "Bedsheets",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
      description: "Crisp percale & smooth sateen sets.",
      href: "/shop/Bedsheets",
    },
    {
      name: "Cushion Covers",
      image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
      description: "Textured solids & artisanal block prints.",
      href: "/shop/Cushion Covers",
    },
    {
      name: "Quilts & Comforters",
      image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
      description: "Cloud-soft Jaipuri mulmul quilts.",
      href: "/shop/Quilts & Comforters",
    },
    {
      name: "Curtains",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
      description: "Minimalist sheers & thermal blackout paneling.",
      href: "/shop/Curtains",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO CAROUSEL SECTION */}
      <HeroCarousel />

      {/* 2. TRUST / VALUE STRIP */}
      <section className="bg-alemah-cream/30 border-y border-alemah-sand/40 py-6 sm:py-8 w-full text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-6 sm:gap-4 justify-around items-center text-sans text-alemah-espresso">
          <div className="flex items-center gap-3.5 text-left max-w-xs">
            <div className="w-10 h-10 rounded-full bg-alemah-red-100 flex items-center justify-center text-alemah-red-600 shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-sm">Best Seller Rating</h5>
              <p className="text-xs text-alemah-taupe mt-0.5">Over 50,000+ happy buyers with 4.5★ stars on top marketplaces.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 text-left max-w-xs">
            <div className="w-10 h-10 rounded-full bg-alemah-red-100 flex items-center justify-center text-alemah-red-600 shrink-0 shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-sm">Free Express Delivery</h5>
              <p className="text-xs text-alemah-taupe mt-0.5">Complimentary express shipping across India on orders above ₹1500.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 text-left max-w-xs">
            <div className="w-10 h-10 rounded-full bg-alemah-red-100 flex items-center justify-center text-alemah-red-600 shrink-0 shadow-sm">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-sm">Easy Exchanges</h5>
              <p className="text-xs text-alemah-taupe mt-0.5">No questions asked exchange and return within 7 days of delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY SECTION */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="font-sans text-xs font-bold text-alemah-red-600 uppercase tracking-widest">
            The Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-alemah-espresso mt-2">
            Elevate Every Corner
          </h2>
          <p className="font-sans text-sm text-alemah-taupe mt-2">
            Carefully curated textile ranges designed to add comfort, texture, and editorial elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative h-96 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-alemah-sand/30 flex items-end p-5 select-none cursor-pointer"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              
              <div className="z-10 text-white flex flex-col gap-1 w-full">
                <h4 className="font-serif text-lg font-semibold flex items-center justify-between">
                  {cat.name}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300" />
                </h4>
                <p className="font-sans text-xs text-white/80 line-clamp-1">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. BESTSELLERS SECTION */}
      <section className="py-16 sm:py-24 bg-alemah-red-050/60 border-y border-alemah-sand/25 w-full textile-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="font-sans text-xs font-bold text-alemah-red-600 uppercase tracking-widest">
                Our Signature Designs
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-alemah-espresso mt-2">
                The Bestsellers
              </h2>
            </div>
            <Link
              href="/shop"
              className="group font-sans text-sm font-semibold text-alemah-red-600 hover:text-alemah-red-700 flex items-center gap-1 mt-3 sm:mt-0 cursor-pointer"
            >
              View all products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. CRAFT NARRATIVE LOOKBOOK STRIP */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-alemah-sand/40">
            <Image
              src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80"
              alt="Jaipuri block print detailing"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col items-start gap-5">
            <span className="font-sans text-xs font-bold text-alemah-red-600 uppercase tracking-widest">
              Sourcing & Quality
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-alemah-espresso leading-tight">
              The Art of Long-Staple Cotton & Hand-Block Print
            </h2>
            <div className="w-16 h-0.5 bg-alemah-red-600 rounded-full my-1"></div>
            <p className="font-sans text-sm sm:text-base text-alemah-taupe leading-relaxed">
              We believe premium bedding isn&apos;t just about high thread counts, but long-staple organic cotton fibers, single-ply yarns, and authentic craftsmanship.
            </p>
            <p className="font-sans text-sm sm:text-base text-alemah-taupe leading-relaxed">
              From our cloud-soft Jaipuri mulmul quilts hand-carded by generational craft artisans to our heavy canvas cushion covers featuring Alemah&apos;s signature weaving watermark motif, every product represents heritage quality, tailored for modern comfort.
            </p>
            <Link
              href="/story"
              className="h-11 px-6 border border-alemah-red-600 text-alemah-red-600 hover:bg-alemah-red-600 hover:text-white font-sans text-xs font-semibold rounded-full ios-active-scale transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              Discover Our Craft
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER / INSTAGRAM GRID */}
      <section className="bg-alemah-cream/45 border-t border-alemah-sand/40 py-16 sm:py-20 w-full text-sans text-alemah-espresso">
        <div className="max-w-4xl mx-auto px-4 text-center flex flex-col items-center gap-5">
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold">Woven to your Inbox</h3>
          <p className="text-sm text-alemah-taupe max-w-md">
            Subscribe to receive styling guides, craft updates, and advance access to our festive linen collections.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-2">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 h-11 px-4 rounded-full border border-alemah-sand bg-background text-sm focus:outline-none focus:border-alemah-red-600 focus:ring-1 focus:ring-alemah-red-600"
            />
            <button
              type="submit"
              className="h-11 px-6 bg-alemah-red-600 hover:bg-alemah-red-700 text-white text-xs font-semibold rounded-full ios-active-scale transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              Sign Up
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
