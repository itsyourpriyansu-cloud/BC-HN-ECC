import { db } from "@/lib/db";
import ProductDetailWrapper from "@/components/product/ProductDetailWrapper";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: { id: true },
  });
  return products.map((prod) => ({
    id: prod.id,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  // 1. Query selected product details including relations
  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: true,
    },
  });

  if (!product) {
    notFound();
  }

  // 2. Query other products in the same category for "Complete the Set" up-sell recommendations
  const crossSells = await db.product.findMany({
    where: {
      category: product.category,
      NOT: { id: product.id },
    },
    include: {
      images: { orderBy: { order: "asc" } },
      variants: true,
    },
    take: 4,
  });

  return (
    <ProductDetailWrapper
      product={product as any}
      crossSells={crossSells as any}
    />
  );
}
