'use client';
import { useState, useEffect } from 'react';
import { getFeaturedProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function Home() {
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFeatured();
    }, []);

    async function loadFeatured() {
        try {
            const data = await getFeaturedProducts();
            setFeatured(data);
        } catch (err) {
            console.error('Chyba:', err);
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
        // Trigger storage event for navbar update
        window.dispatchEvent(new Event('storage'));
    }

  return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/20 rounded-full blur-3xl opacity-20" />
                
                <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        D1 Repository Pattern
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold text-zinc-100 mb-6 tracking-tight">
                        Moderní
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600"> E-Shop</span>
          </h1>
                    
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                        Školní projekt demonstrující Repository Pattern, transakce a práci s relační databází.
                    </p>
                    
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/products" className="btn-primary">
                            Prohlédnout produkty
                        </Link>
                        <Link href="/admin" className="btn-secondary">
                            Admin panel
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-zinc-100">Doporučené produkty</h2>
                        <p className="text-zinc-500 mt-1">Nejlepší výběr pro vás</p>
                    </div>
                    <Link href="/products" className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-2 transition-colors">
                        Vše zobrazit
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
                
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="card animate-pulse">
                                <div className="aspect-square rounded-xl bg-zinc-800 mb-4" />
                                <div className="h-5 bg-zinc-800 rounded w-3/4 mb-3" />
                                <div className="h-8 bg-zinc-800 rounded w-1/2" />
                            </div>
                        ))}
        </div>
                ) : featured.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featured.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product}
                                onAddToCart={addToCart}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-zinc-500">
                        Žádné doporučené produkty
                    </div>
                )}
            </section>

            {/* Features */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card text-center">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-100 mb-2">Repository Pattern</h3>
                        <p className="text-zinc-500 text-sm">Čistá architektura s oddělením datové vrstvy</p>
                    </div>
                    
                    <div className="card text-center">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-100 mb-2">SQL Server</h3>
                        <p className="text-zinc-500 text-sm">Relační databáze s transakcemi a views</p>
                    </div>
                    
                    <div className="card text-center">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-100 mb-2">REST API</h3>
                        <p className="text-zinc-500 text-sm">Flask backend s CRUD operacemi</p>
                    </div>
        </div>
            </section>
    </div>
  );
}
