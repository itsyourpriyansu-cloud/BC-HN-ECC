"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useSession } from "next-auth/react";
import { useUIStore } from "@/store/useUIStore";
import { useRouter } from "next/navigation";
import { Mail, MapPin, Truck, CreditCard, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, subtotal, shippingCost, totalAmount, clearCart } = useCart();
  const addToast = useUIStore((state) => state.addToast);
  const router = useRouter();

  // Loading indicator
  const [loading, setLoading] = useState(false);

  // Guest checkout form inputs
  const [guestEmail, setGuestEmail] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  // Address inputs
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Delivery preferences
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");

  // Payment preferences
  const [paymentMethod, setPaymentMethod] = useState<"PHONEPE" | "COD">("PHONEPE");

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center flex flex-col items-center justify-center gap-5">
        <div className="w-16 h-16 rounded-full bg-alemah-cream flex items-center justify-center text-alemah-red-600 shadow-inner">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-alemah-espresso">Your bag is empty</h2>
        <p className="font-sans text-sm text-alemah-taupe">You cannot checkout without adding items to your shopping bag first.</p>
        <button
          onClick={() => router.push("/shop")}
          className="h-11 px-6 bg-alemah-red-600 hover:bg-alemah-red-700 text-white font-sans text-xs font-semibold rounded-full shadow-sm cursor-pointer transition-colors"
        >
          Explore Products
        </button>
      </div>
    );
  }

  // Calculate delivery adjustment
  const deliveryExtraPrice = deliveryMethod === "express" ? 250 : 0;
  const finalTotalAmount = totalAmount + deliveryExtraPrice;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check pincode limit for COD
    if (paymentMethod === "COD" && postalCode.startsWith("9")) {
      addToast("Cash on Delivery (COD) is not eligible for this pincode.", "error");
      return;
    }

    setLoading(true);

    const addressData = {
      street,
      city,
      state,
      postalCode,
      country: "India",
    };

    const guestInfo = session
      ? null
      : {
          email: guestEmail,
          name: guestName,
          phone: guestPhone,
        };

    try {
      console.log("Submitting order payload...");
      const response = await fetch("/api/payments/phonepe/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id ?? null,
          guestInfo,
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
            price: i.price,
          })),
          totalAmount: finalTotalAmount,
          shippingAddress: addressData,
          paymentMethod: paymentMethod,
        }),
      });

      const data = await response.json();

      if (data.success && data.redirectUrl) {
        // Clear local Zustand cart before redirecting
        clearCart();
        addToast(
          paymentMethod === "COD" 
            ? "Order placed successfully!" 
            : "Redirecting to PhonePe secure checkout...",
          "success"
        );
        
        // Redirect browser to either success landing or PhonePe preprod gateway page
        window.location.href = data.redirectUrl;
      } else {
        addToast(data.error || "Order compilation failed", "error");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      addToast("An error occurred during order submission.", "error");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* LEFT COLUMN: checkout Form (Tabs 1-4) */}
        <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 flex flex-col gap-6 sm:gap-8 font-sans">
          
          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-alemah-espresso border-b border-alemah-sand/30 pb-4">
            Secure Checkout
          </h1>

          {/* Section 1: Customer Contact Info */}
          {!session && (
            <div className="border border-alemah-sand/40 rounded-2xl p-5 bg-background shadow-sm flex flex-col gap-4">
              <h3 className="font-serif text-lg font-bold text-alemah-espresso flex items-center gap-2">
                <Mail className="w-4 h-4 text-alemah-red-600" />
                1. Contact Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-alemah-espresso pl-0.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="h-10 px-3 rounded-xl border border-alemah-sand bg-alemah-cream/10 text-xs focus:outline-none focus:border-alemah-red-600 focus:ring-1 focus:ring-alemah-red-600"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-alemah-espresso pl-0.5">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="h-10 px-3 rounded-xl border border-alemah-sand bg-alemah-cream/10 text-xs focus:outline-none focus:border-alemah-red-600 focus:ring-1 focus:ring-alemah-red-600"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-alemah-espresso pl-0.5">Buyer Full Name</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter full name"
                  className="h-10 px-3 rounded-xl border border-alemah-sand bg-alemah-cream/10 text-xs focus:outline-none focus:border-alemah-red-600 focus:ring-1 focus:ring-alemah-red-600"
                />
              </div>
            </div>
          )}

          {/* Section 2: Shipping Address */}
          <div className="border border-alemah-sand/40 rounded-2xl p-5 bg-background shadow-sm flex flex-col gap-4">
            <h3 className="font-serif text-lg font-bold text-alemah-espresso flex items-center gap-2">
              <MapPin className="w-4 h-4 text-alemah-red-600" />
              {session ? "1. Shipping Address" : "2. Shipping Address"}
            </h3>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-alemah-espresso pl-0.5">Street Address</label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="House / Apartment no., Street name, Landmark"
                className="h-10 px-3 rounded-xl border border-alemah-sand bg-alemah-cream/10 text-xs focus:outline-none focus:border-alemah-red-600 focus:ring-1 focus:ring-alemah-red-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-alemah-espresso pl-0.5">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru"
                  className="h-10 px-3 rounded-xl border border-alemah-sand bg-alemah-cream/10 text-xs focus:outline-none focus:border-alemah-red-600 focus:ring-1 focus:ring-alemah-red-600"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-alemah-espresso pl-0.5">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Karnataka"
                  className="h-10 px-3 rounded-xl border border-alemah-sand bg-alemah-cream/10 text-xs focus:outline-none focus:border-alemah-red-600 focus:ring-1 focus:ring-alemah-red-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-alemah-espresso pl-0.5">PIN Code (6-digit)</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 560038"
                  className="h-10 px-3 rounded-xl border border-alemah-sand bg-alemah-cream/10 text-xs focus:outline-none focus:border-alemah-red-600 focus:ring-1 focus:ring-alemah-red-600"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-alemah-espresso pl-0.5">Country</label>
                <input
                  type="text"
                  disabled
                  value="India"
                  className="h-10 px-3 rounded-xl border border-alemah-sand bg-alemah-sand/15 text-alemah-taupe text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Delivery Options */}
          <div className="border border-alemah-sand/40 rounded-2xl p-5 bg-background shadow-sm flex flex-col gap-4">
            <h3 className="font-serif text-lg font-bold text-alemah-espresso flex items-center gap-2">
              <Truck className="w-4 h-4 text-alemah-red-600" />
              {session ? "2. Delivery Method" : "3. Delivery Method"}
            </h3>

            <div className="flex flex-col gap-3">
              {/* Standard */}
              <label
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer ios-active-scale transition-all ${
                  deliveryMethod === "standard"
                    ? "border-alemah-red-600 bg-alemah-red-050"
                    : "border-alemah-sand/50 bg-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === "standard"}
                    onChange={() => setDeliveryMethod("standard")}
                    className="accent-alemah-red-600"
                  />
                  <div>
                    <span className="text-xs font-semibold text-alemah-espresso block">Standard Delivery</span>
                    <span className="text-[10px] text-alemah-taupe block mt-0.5">Takes 3-5 business days.</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-alemah-espresso">
                  {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                </span>
              </label>

              {/* Express */}
              <label
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer ios-active-scale transition-all ${
                  deliveryMethod === "express"
                    ? "border-alemah-red-600 bg-alemah-red-050"
                    : "border-alemah-sand/50 bg-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === "express"}
                    onChange={() => setDeliveryMethod("express")}
                    className="accent-alemah-red-600"
                  />
                  <div>
                    <span className="text-xs font-semibold text-alemah-espresso block">Priority Express Delivery</span>
                    <span className="text-[10px] text-alemah-taupe block mt-0.5">Guaranteed dispatch. Arrives in 1-2 days.</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-alemah-espresso">+₹250</span>
              </label>
            </div>
          </div>

          {/* Section 4: Payment Gateway selection */}
          <div className="border border-alemah-sand/40 rounded-2xl p-5 bg-background shadow-sm flex flex-col gap-4">
            <h3 className="font-serif text-lg font-bold text-alemah-espresso flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-alemah-red-600" />
              {session ? "3. Payment Gateway Selection" : "4. Payment Gateway Selection"}
            </h3>

            <div className="flex flex-col gap-3">
              {/* PhonePe */}
              <label
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer ios-active-scale transition-all ${
                  paymentMethod === "PHONEPE"
                    ? "border-alemah-red-600 bg-alemah-red-050"
                    : "border-alemah-sand/50 bg-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "PHONEPE"}
                    onChange={() => setPaymentMethod("PHONEPE")}
                    className="accent-alemah-red-600"
                  />
                  <div>
                    <span className="text-xs font-semibold text-alemah-espresso block flex items-center gap-1.5">
                      PhonePe Gateway (UPI / Cards / Net Banking)
                    </span>
                    <span className="text-[10px] text-alemah-taupe block mt-0.5">Redirects securely to complete payment.</span>
                  </div>
                </div>
                {/* Simulated PhonePe small icon badge */}
                <div className="w-16 h-7 rounded bg-[#5f259f] text-white font-sans text-[10px] font-bold flex items-center justify-center tracking-wider">
                  PhonePe
                </div>
              </label>

              {/* COD */}
              <label
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer ios-active-scale transition-all ${
                  paymentMethod === "COD"
                    ? "border-alemah-red-600 bg-alemah-red-050"
                    : "border-alemah-sand/50 bg-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="accent-alemah-red-600"
                  />
                  <div>
                    <span className="text-xs font-semibold text-alemah-espresso block">Cash on Delivery (COD)</span>
                    <span className="text-[10px] text-alemah-taupe block mt-0.5">Pay in cash upon physical package delivery.</span>
                  </div>
                </div>
                <span className="text-[10px] text-alemah-taupe font-semibold bg-alemah-cream border border-alemah-sand/40 px-2 py-1 rounded">COD</span>
              </label>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-alemah-red-600 hover:bg-alemah-red-700 text-white font-sans text-sm font-semibold flex items-center justify-center gap-2 shadow-md ios-active-scale transition-colors cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              "Compiling Order..."
            ) : (
              <>
                Confirm & Pay ₹{finalTotalAmount}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* RIGHT COLUMN: Price summary & Items List */}
        <aside className="lg:col-span-5 flex flex-col gap-6 font-sans">
          
          <div className="border border-alemah-sand/40 rounded-2xl p-5 bg-alemah-cream/15 relative">
            <h3 className="font-serif text-lg font-bold text-alemah-espresso mb-4">
              Order Summary
            </h3>

            {/* List of items */}
            <div className="flex flex-col gap-4 max-h-72 overflow-y-auto mb-4 pr-1">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3 items-center text-xs">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-alemah-cream shrink-0 border border-alemah-sand/35">
                    <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-alemah-espresso truncate">{item.name}</h5>
                    <p className="text-[10px] text-alemah-taupe mt-0.5">
                      Qty: {item.quantity} &bull; Size: {item.size.split(" (")[0]}
                    </p>
                  </div>
                  <span className="font-bold text-alemah-espresso shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-alemah-sand/30 my-4"></div>

            {/* Price Calculations */}
            <div className="flex flex-col gap-2.5 text-xs text-alemah-taupe mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-alemah-espresso font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({deliveryMethod === "express" ? "Express" : "Standard"})</span>
                <span className="text-alemah-espresso font-semibold">
                  {deliveryMethod === "express" ? "₹250" : shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                </span>
              </div>
              
              <div className="border-t border-alemah-sand/30 my-1"></div>
              
              <div className="flex justify-between text-sm font-bold text-alemah-espresso">
                <span>Final Total</span>
                <span className="text-alemah-red-600 text-base">₹{finalTotalAmount}</span>
              </div>
            </div>

            {/* Secured badge */}
            <div className="bg-background/90 p-3 rounded-xl border border-alemah-sand/40 flex items-center gap-2.5 text-[10px] text-alemah-taupe">
              <ShieldCheck className="w-5 h-5 text-ios-green shrink-0" />
              <span>We secure your connection using SSL. PhonePe provides 128-bit encryption keys.</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
