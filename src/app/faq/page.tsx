export default function FAQPage() {
  const faqs = [
    {
      q: "What fabric does Alemah use for bedsheets?",
      a: "We craft our bedsheets using 100% organic long-staple cotton, single-ply yarns, in both crisp percale and silky sateen weaves. Long-staple cotton ensures the sheets get softer with every wash and do not pill.",
    },
    {
      q: "How do I care for and wash my home textiles?",
      a: "We recommend washing in cold water on a gentle cycle using mild, liquid detergent. Line drying in shade is ideal to preserve block print colors. If tumble drying, use a low temperature setting and remove promptly to minimize wrinkles.",
    },
    {
      q: "Is shipping free?",
      a: "Yes! We offer complimentary express delivery across India on all orders exceeding ₹1500. For orders under ₹1500, a flat shipping fee of ₹99 is applied during payment checkout.",
    },
    {
      q: "How do exchanges and returns work?",
      a: "We provide a no-questions-asked 7-day exchange or return window. If you are not satisfied with your purchase, simply request a return from your account dashboard. We will coordinate a free pickup from your address.",
    },
    {
      q: "Are the block prints handmade?",
      a: "Yes. Our quilts and cushion covers feature authentic hand-block prints, created by generational artisans in Jaipur. Since each piece is hand-pressed, minor color variations may occur, adding to the unique charm of the textile.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 font-sans text-alemah-espresso w-full">
      <div className="border-b border-alemah-sand/40 pb-6 sm:pb-8 mb-8 sm:mb-12">
        <span className="text-xs font-bold text-alemah-red-600 uppercase tracking-widest block mb-1">
          Help Center
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-alemah-espresso">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-alemah-taupe mt-2">
          Everything you need to know about our sourcing, care instructions, and delivery support.
        </p>
      </div>

      <div className="flex flex-col gap-6 sm:gap-8">
        {faqs.map((faq) => (
          <div key={faq.q} className="p-5 sm:p-6 bg-alemah-cream/20 border border-alemah-sand/35 rounded-2xl flex flex-col gap-2.5">
            <h3 className="font-serif text-base sm:text-lg font-bold text-alemah-espresso">
              {faq.q}
            </h3>
            <p className="text-sm text-alemah-taupe leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
