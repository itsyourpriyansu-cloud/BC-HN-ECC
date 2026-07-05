import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function OurStoryPage() {
  return (
    <div className="flex flex-col w-full">
      {/* HERO */}
      <section className="relative h-[55vh] min-h-[380px] flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=80"
          alt="Heritage loom craftsmanship"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <span className="font-sans text-xs font-bold text-alemah-red-600 uppercase tracking-widest">Our Story</span>
          <h1 className="font-serif text-3xl sm:text-6xl font-extrabold text-alemah-espresso mt-2 leading-tight">
            Woven With Legacy.<br />
            <span className="italic text-alemah-red-600">Crafted for Now.</span>
          </h1>
        </div>
      </section>

      {/* Narrative Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col gap-20 sm:gap-28 w-full">

        {/* Origin Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-5">
            <span className="font-sans text-xs font-bold text-alemah-gold uppercase tracking-widest">The Beginning</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-alemah-espresso leading-tight">
              From a Single Loom to 50,000+ Happy Homes
            </h2>
            <div className="w-12 h-0.5 bg-alemah-red-600 rounded-full" />
            <p className="font-sans text-sm text-alemah-taupe leading-relaxed">
              Alemah was born in the textile heartlands of Rajasthan, where every thread is a story passed down through generations of weavers. What started as a small atelier supplying premium bedding to boutique hotels became a beloved marketplace brand, shipping to over 50,000 homes across India.
            </p>
            <p className="font-sans text-sm text-alemah-taupe leading-relaxed">
              Our name, Alemah, is derived from the Arabic for "knowledgeable" — reflecting our deep commitment to the craft and science of textile making: understanding fiber lengths, weave densities, dye permanence, and finish quality.
            </p>
          </div>
          <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-alemah-sand/30">
            <Image
              src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80"
              alt="Artisan quilt making process"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Fabric & Craft section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-alemah-sand/30">
            <Image
              src="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80"
              alt="Premium thread count textile"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="order-1 lg:order-2 flex flex-col gap-5">
            <span className="font-sans text-xs font-bold text-alemah-gold uppercase tracking-widest">Fabric & Craft</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-alemah-espresso leading-tight">
              The Science Behind the Softness
            </h2>
            <div className="w-12 h-0.5 bg-alemah-red-600 rounded-full" />
            <p className="font-sans text-sm text-alemah-taupe leading-relaxed">
              We source exclusively certified long-staple organic cotton (Supima and Giza) from controlled farms in Gujarat and Tamil Nadu. Unlike conventional short-staple cotton, our extra-long fibers create fewer breaking points in the yarn — resulting in sheets that are not just softer to the touch, but dramatically more durable.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {[
                { label: "300–400 TC", desc: "Thread Count Range" },
                { label: "100% Organic", desc: "Cotton Certified" },
                { label: "Oeko-Tex", desc: "Standard 100 Certified" },
                { label: "Hand-quilted", desc: "Mulmul Quilts" },
              ].map((spec) => (
                <div key={spec.label} className="bg-alemah-cream/30 border border-alemah-sand/30 rounded-xl p-3 flex flex-col gap-0.5">
                  <span className="font-serif text-sm font-bold text-alemah-red-600">{spec.label}</span>
                  <span className="font-sans text-[10px] text-alemah-taupe font-medium uppercase tracking-wider">{spec.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center flex flex-col items-center gap-5 py-6">
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-alemah-espresso">
            Experience the Alemah Difference
          </h3>
          <p className="font-sans text-sm text-alemah-taupe max-w-md">
            Browse our full collection of premium home textiles, crafted with the legacy of Indian weaving artisanship.
          </p>
          <Link
            href="/shop"
            className="h-12 px-8 bg-alemah-red-600 hover:bg-alemah-red-700 text-white font-sans text-sm font-semibold rounded-full ios-active-scale transition-colors shadow-md flex items-center gap-2"
          >
            Shop the Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
