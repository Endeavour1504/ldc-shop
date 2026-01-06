import { getProducts, getDashboardStats, getSetting } from "@/lib/db/queries"
import { AdminProductsContent } from "@/components/admin/products-content"

export default async function AdminPage() {
    const [products, stats, shopName] = await Promise.all([
        getProducts(),
        getDashboardStats(),
        (async () => {
            try {
                return await getSetting('shop_name')
            } catch {
                return null
            }
        })(),
    ])

    return (
        <AdminProductsContent
            products={products.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                category: p.category,
                stockCount: p.stock,
                isActive: p.isActive ?? true,
                sortOrder: p.sortOrder ?? 0
            }))}
            stats={stats}
            shopName={shopName}
        />
    )
}
