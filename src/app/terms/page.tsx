export default function TermsPage() {
  const sections = [
    {
      title: "1. Terminology & Agreement",
      content:
        "By accessing this digital flagship storefront and shopping with Alemah, you agree to comply with our Terms of Service, shipping parameters, and refund guides. All design tokens, trademark graphics, block print templates, and textile patterns represent proprietary assets.",
    },
    {
      title: "2. Shipping & Delivery",
      content:
        "We offer complimentary express delivery across India on purchase orders exceeding ₹1500. Expected delivery timelines are provided as estimates during payment checkout and trackable via your user account panel.",
    },
    {
      title: "3. 7-Day Exchange & Returns",
      content:
        "We want you to love your home textiles. We offer a no-questions-asked 7-day exchange and return policy on unwashed, unused bedding, cushion covers, and quilts in their original packaging. Return shipping pickups are managed dynamically.",
    },
    {
      title: "4. Pricing & Product Descriptions",
      content:
        "Alemah strives for catalog precision. Product specifications (thread count, fabric weight, block print motifs) and transaction prices are updated on the fly. Variant price adjustments are listed clearly.",
    },
    {
      title: "5. Limitation of Liability",
      content:
        "Alemah Textiles is not responsible for secondary damages arising from shipment delays, stock exhaustion, or transactional errors during checkout, except as required under consumer safety regulations.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 font-sans text-alemah-espresso w-full">
      <div className="border-b border-alemah-sand/40 pb-6 sm:pb-8 mb-8 sm:mb-12">
        <span className="text-xs font-bold text-alemah-red-600 uppercase tracking-widest block mb-1">
          Last Updated: July 2026
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-alemah-espresso">
          Terms of Service
        </h1>
        <p className="text-sm text-alemah-taupe mt-2">
          Please review these parameters carefully before placing an order.
        </p>
      </div>

      <div className="flex flex-col gap-8 sm:gap-10">
        {sections.map((sec) => (
          <div key={sec.title} className="flex flex-col gap-3">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-alemah-espresso">
              {sec.title}
            </h3>
            <p className="text-sm text-alemah-taupe leading-relaxed text-justify">
              {sec.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
