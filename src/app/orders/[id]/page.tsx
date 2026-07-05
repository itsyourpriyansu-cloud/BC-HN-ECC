import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { CheckCircle, Package, Truck, Home, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

const STATUS_STEPS = [
  { key: "PLACED", label: "Order Placed", icon: CheckCircle },
  { key: "PACKED", label: "Packed & Ready", icon: Package },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: Clock },
  { key: "DELIVERED", label: "Delivered", icon: Home },
];

export default async function OrderTrackingPage({ params }: OrderPageProps) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          variant: {
            include: { product: { include: { images: { orderBy: { order: "asc" }, take: 1 } } } },
          },
        },
      },
    },
  });

  if (!order) notFound();

  const address = JSON.parse(order.shippingAddress || "{}");
  const currentStatusIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const activeIndex = currentStatusIndex === -1 ? 0 : currentStatusIndex;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col gap-8 w-full font-sans">
      <div className="border-b border-alemah-sand/30 pb-6">
        <span className="text-xs font-bold text-alemah-red-600 uppercase tracking-widest block mb-1">
          Order Tracking
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-alemah-espresso">
          Order #{order.id.slice(-8).toUpperCase()}
        </h1>
        <p className="text-xs text-alemah-taupe mt-1">
          Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
        </p>
      </div>

      {/* Status Timeline */}
      <div className="border border-alemah-sand/40 rounded-2xl p-5 sm:p-6 bg-background shadow-sm">
        <h3 className="font-serif text-base font-bold text-alemah-espresso mb-6">Delivery Status</h3>
        <div className="relative flex flex-col gap-6">
          {STATUS_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= activeIndex;
            const isActive = index === activeIndex;

            return (
              <div key={step.key} className="flex items-center gap-4 relative">
                {/* Connector line */}
                {index < STATUS_STEPS.length - 1 && (
                  <div
                    className={`absolute left-[19px] top-10 w-0.5 h-6 transition-colors ${
                      index < activeIndex ? "bg-ios-green" : "bg-alemah-sand/50"
                    }`}
                  />
                )}

                {/* Step circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                    isCompleted
                      ? "bg-ios-green border-ios-green text-white"
                      : "bg-background border-alemah-sand/50 text-alemah-sand"
                  } ${isActive ? "ring-4 ring-ios-green/20" : ""}`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>

                <div>
                  <p className={`text-sm font-semibold ${isCompleted ? "text-alemah-espresso" : "text-alemah-taupe"}`}>
                    {step.label}
                  </p>
                  {isActive && (
                    <p className="text-[10px] text-ios-green font-bold uppercase tracking-wider mt-0.5">
                      Current Status
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items in order */}
      <div className="border border-alemah-sand/40 rounded-2xl p-5 bg-background shadow-sm">
        <h3 className="font-serif text-base font-bold text-alemah-espresso mb-4">Items in Order</h3>
        <div className="flex flex-col gap-3">
          {order.items.map((item) => {
            const product = item.variant.product;
            const image = product.images[0]?.url;
            return (
              <div key={item.id} className="flex gap-4 items-center text-xs border-b border-alemah-sand/20 pb-3 last:border-b-0 last:pb-0">
                {image && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-alemah-cream shrink-0 border border-alemah-sand/30">
                    <Image src={image} alt={product.name} fill sizes="48px" className="object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-alemah-espresso">{product.name}</p>
                  <p className="text-alemah-taupe mt-0.5">
                    {item.variant.size.split(" (")[0]} • {item.variant.color} × {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-alemah-espresso shrink-0">₹{item.price * item.quantity}</span>
              </div>
            );
          })}
        </div>

        <div className="border-t border-alemah-sand/30 mt-4 pt-4 flex justify-between text-sm font-bold text-alemah-espresso">
          <span>Total Paid</span>
          <span className="text-alemah-red-600">₹{order.totalAmount}</span>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="border border-alemah-sand/40 rounded-2xl p-5 bg-background shadow-sm text-xs text-alemah-taupe">
        <h3 className="font-serif text-base font-bold text-alemah-espresso mb-3">Delivery Address</h3>
        <p className="font-semibold text-alemah-espresso">{order.guestName || "—"}</p>
        <p className="mt-1">{address.street}</p>
        <p>{address.city}, {address.state} — {address.postalCode}</p>
        <p>{address.country}</p>
      </div>

      <Link href="/shop" className="w-full h-11 bg-alemah-red-600 hover:bg-alemah-red-700 text-white font-sans text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 shadow-sm ios-active-scale transition-colors">
        Continue Shopping
      </Link>
    </div>
  );
}
