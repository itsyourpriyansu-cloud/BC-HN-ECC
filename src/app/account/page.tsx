import { db } from "@/lib/db";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Package, MapPin, Heart, User, LogOut } from "lucide-react";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const userId = session.user.id as string;

  const [orders, addresses] = await Promise.all([
    db.order.findMany({
      where: { userId },
      include: { items: { include: { variant: { include: { product: true } } } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    db.address.findMany({ where: { userId }, orderBy: { isDefault: "desc" } }),
  ]);

  const STATUS_COLORS: Record<string, string> = {
    PENDING: "text-ios-yellow bg-ios-yellow/10 border-ios-yellow/30",
    PLACED: "text-ios-blue bg-ios-blue/10 border-ios-blue/30",
    SHIPPED: "text-alemah-gold bg-alemah-gold/10 border-alemah-gold/30",
    OUT_FOR_DELIVERY: "text-alemah-gold bg-alemah-gold/10 border-alemah-gold/30",
    DELIVERED: "text-ios-green bg-ios-green/10 border-ios-green/30",
    CANCELLED: "text-ios-red bg-ios-red/10 border-ios-red/30",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col gap-10 w-full font-sans">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-alemah-sand/30 pb-8">
        <div className="w-16 h-16 rounded-full bg-alemah-red-100 border-2 border-alemah-red-600/30 flex items-center justify-center font-serif text-2xl font-bold text-alemah-red-600 shadow-sm shrink-0">
          {session.user?.name?.charAt(0) || "A"}
        </div>
        <div className="flex-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-alemah-espresso">
            {session.user?.name}
          </h1>
          <p className="text-xs text-alemah-taupe mt-0.5">
            {session.user?.email || session.user?.phone}
          </p>
        </div>
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-1.5 text-xs text-ios-red border border-ios-red/30 rounded-full px-4 h-9 hover:bg-ios-red/5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </Link>
      </div>

      {/* Orders Section */}
      <section>
        <h2 className="font-serif text-xl font-bold text-alemah-espresso flex items-center gap-2 mb-5">
          <Package className="w-5 h-5 text-alemah-red-600" />
          Your Orders
        </h2>

        {orders.length === 0 ? (
          <div className="border border-dashed border-alemah-sand/60 rounded-2xl p-8 text-center flex flex-col items-center gap-3">
            <Package className="w-10 h-10 text-alemah-sand" />
            <p className="font-semibold text-alemah-espresso text-sm">No orders yet</p>
            <p className="text-xs text-alemah-taupe max-w-xs">Your order history will appear here after your first purchase.</p>
            <Link href="/shop" className="h-9 px-5 bg-alemah-red-600 text-white text-xs font-semibold rounded-full mt-2 flex items-center hover:bg-alemah-red-700 transition-colors ios-active-scale shadow-sm">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <Link
                href={`/orders/${order.id}`}
                key={order.id}
                className="border border-alemah-sand/40 rounded-2xl p-4 sm:p-5 bg-background hover:bg-alemah-cream/20 transition-colors group shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-xs font-bold text-alemah-espresso font-mono">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${STATUS_COLORS[order.status] || ""}`}>
                      {order.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-[11px] text-alemah-taupe">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })} &bull;{" "}
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-alemah-taupe mt-0.5 capitalize">
                    Payment: {order.paymentMethod} &bull; {order.paymentStatus}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-alemah-red-600 text-sm">₹{order.totalAmount}</span>
                  <span className="text-xs text-alemah-red-600 font-semibold group-hover:underline">Track →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Addresses Section */}
      <section>
        <h2 className="font-serif text-xl font-bold text-alemah-espresso flex items-center gap-2 mb-5">
          <MapPin className="w-5 h-5 text-alemah-red-600" />
          Saved Addresses
        </h2>

        {addresses.length === 0 ? (
          <div className="border border-dashed border-alemah-sand/60 rounded-2xl p-6 text-center text-xs text-alemah-taupe">
            No saved addresses. Addresses are saved automatically when you checkout.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="border border-alemah-sand/40 rounded-2xl p-4 bg-background shadow-sm text-xs text-alemah-taupe relative">
                {addr.isDefault && (
                  <span className="absolute top-3 right-3 text-[9px] font-bold text-ios-green bg-ios-green/10 border border-ios-green/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Default
                  </span>
                )}
                <p className="font-semibold text-alemah-espresso text-sm mb-1">{addr.name}</p>
                <p>{addr.street}</p>
                <p>{addr.city}, {addr.state} — {addr.postalCode}</p>
                <p className="mt-1 text-alemah-taupe/70">{addr.phone}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
