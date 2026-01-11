'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const updateCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
        };
        updateCount();
        window.addEventListener('storage', updateCount);
        // Check every second for cart changes
        const interval = setInterval(updateCount, 1000);
        return () => {
            window.removeEventListener('storage', updateCount);
            clearInterval(interval);
        };
    }, []);

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                            <span className="text-zinc-950 font-bold text-sm">E</span>
                        </div>
                        <span className="text-xl font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                            Shop
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-1">
                        <Link 
                            href="/products" 
                            className="px-4 py-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-lg transition-all duration-200"
                        >
                            Produkty
                        </Link>
                        <Link 
                            href="/cart" 
                            className="px-4 py-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-lg transition-all duration-200 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Košík
                            {cartCount > 0 && (
                                <span className="bg-emerald-500 text-zinc-950 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <Link 
                            href="/admin" 
                            className="ml-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg border border-zinc-700 transition-all duration-200"
                        >
                            Admin
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
