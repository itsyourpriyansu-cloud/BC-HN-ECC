export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content:
        "We collect information you provide directly to us when purchasing home textiles, creating an account, subscribing to our email updates, or contacting customer support. This includes name, billing and shipping address, email, telephone number, and transaction details.",
    },
    {
      title: "2. How We Use Information",
      content:
        "We utilize your information to process transactions, manage deliveries across India, send order notifications and tracking numbers, resolve service issues, and deliver marketing campaigns or block print styling guides.",
    },
    {
      title: "3. Payment & Transaction Security",
      content:
        "All transactions are completed using standard secure payment processors (such as PhonePe). We do not store or save credit card numbers, net banking credentials, or wallet details on our local database server.",
    },
    {
      title: "4. Cookies & Site Analytics",
      content:
        "We use browser cookies to persistent your shopping cart state and optimize navigation speeds. Anonymous interaction stats are reviewed to make the user interface sleeker and more accessible.",
    },
    {
      title: "5. Policy Revisions",
      content:
        "Alemah reserves the right to modify this policy statement. Significant updates will be outlined on this page or sent directly to your registered email address.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 font-sans text-alemah-espresso w-full">
      <div className="border-b border-alemah-sand/40 pb-6 sm:pb-8 mb-8 sm:mb-12">
        <span className="text-xs font-bold text-alemah-red-600 uppercase tracking-widest block mb-1">
          Last Updated: July 2026
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-alemah-espresso">
          Privacy Policy
        </h1>
        <p className="text-sm text-alemah-taupe mt-2">
          Your privacy is vital to us. This notice details what transaction information we manage and how we safeguard your details.
        </p>
      </div>

      <div className="flex flex-col gap-8 sm:gap-10">
        {sections.map((sec) => (
          <div key={sec.title} className="flex flex-col gap-3">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-alemah-espresso">
              {sec.title}
            </h3>
            <p className="text-sm text-alemah-taupe leading-relaxed">
              {sec.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
