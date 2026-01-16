'use client';
import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [productsData, categoriesData] = await Promise.all([
                getProducts(),
                getCategories()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (err) {
            setError('Chyba při načítání produktů');
        } finally {
            setLoading(false);
        }
    }

    function addToCart(product) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(item => item.id === product.id);
        
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('storage'));
    }

    // Filtrované produkty
    const filteredProducts = selectedCategory
        ? products.filter(p => p.category_id === selectedCategory)
        : products;

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-red-400 mb-2">{error}</h2>
                    <p className="text-zinc-500">Zkontrolujte, zda backend běží na portu 5000</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-zinc-100 mb-3">Všechny produkty</h1>
                <p className="text-zinc-500">
                    {loading ? 'Načítám...' : `${filteredProducts.length} produktů v nabídce`}
                </p>
            </div>

            {/* Category Filter */}
            {!loading && categories.length > 0 && (
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                selectedCategory === null
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                            }`}
                        >
                            Vše ({products.length})
                        </button>
                        {categories.map(cat => {
                            const count = products.filter(p => p.category_id === cat.id).length;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                        selectedCategory === cat.id
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                                    }`}
                                >
                                    {cat.name} ({count})
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Products Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="card animate-pulse">
                            <div className="aspect-square rounded-xl bg-zinc-800 mb-4" />
                            <div className="h-5 bg-zinc-800 rounded w-3/4 mb-3" />
                            <div className="h-8 bg-zinc-800 rounded w-1/2 mb-4" />
                            <div className="flex gap-2">
                                <div className="flex-1 h-10 bg-zinc-800 rounded-lg" />
                                <div className="flex-1 h-10 bg-zinc-800 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onAddToCart={addToCart}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-zinc-800 flex items-center justify-center">
                        <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-zinc-400 mb-2">
                        {selectedCategory ? 'Žádné produkty v této kategorii' : 'Žádné produkty'}
                    </h2>
                    <p className="text-zinc-600">
                        {selectedCategory 
                            ? 'Zkuste vybrat jinou kategorii' 
                            : 'Přidejte produkty v admin panelu'}
                    </p>
                </div>
            )}
        </div>
    );
}
