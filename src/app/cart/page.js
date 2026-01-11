'use client';
import { useState, useEffect } from 'react';
import { createOrder } from '@/lib/api';
import Link from 'next/link';

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(savedCart);
    }, []);

    function removeFromCart(productId) {
        const newCart = cart.filter(item => item.id !== productId);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('storage'));
    }

    function updateQuantity(productId, quantity) {
        const newCart = cart.map(item => {
            if (item.id === productId) {
                return { ...item, quantity: Math.max(1, quantity) };
            }
            return item;
        });
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('storage'));
    }

    async function submitOrder() {
        if (cart.length === 0) return;

        setLoading(true);
        try {
            const orderData = {
                user_id: 1,
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    unit_price: item.price
                }))
            };

            const result = await createOrder(orderData);
            setCart([]);
            localStorage.setItem('cart', '[]');
            window.dispatchEvent(new Event('storage'));
            alert(`Objednávka vytvořena! ID: ${result.order_id}`);
        } catch (err) {
            alert('Chyba při vytváření objednávky');
        } finally {
            setLoading(false);
        }
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (!mounted) return null;

    return (
        <div className="max-w-4xl mx-auto px-6 py-16">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-zinc-100 mb-3">Nákupní košík</h1>
                <p className="text-zinc-500">
                    {cart.length === 0 ? 'Váš košík je prázdný' : `${cart.length} položek v košíku`}
                </p>
            </div>

            {cart.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-zinc-800 flex items-center justify-center">
                        <svg className="w-12 h-12 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-zinc-400 mb-4">Košík je prázdný</h2>
                    <Link href="/products" className="btn-primary inline-block">
                        Prohlédnout produkty
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Cart Items */}
                    <div className="space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="card flex items-center gap-6">
                                {/* Product Icon */}
                                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-zinc-700/50" />
                                </div>
                                
                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-zinc-100 truncate">{item.name}</h3>
                                    <p className="text-emerald-400 font-medium">{item.price.toLocaleString('cs-CZ')} Kč</p>
                                </div>
                                
                                {/* Quantity */}
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 flex items-center justify-center transition-colors"
                                    >
                                        −
                                    </button>
                                    <input 
                                        type="number" 
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                        min="1"
                                        className="w-16 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-center text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    />
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 flex items-center justify-center transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                
                                {/* Item Total */}
                                <div className="text-right w-32">
                                    <p className="text-lg font-semibold text-zinc-100">
                                        {(item.price * item.quantity).toLocaleString('cs-CZ')} Kč
                                    </p>
                                </div>
                                
                                {/* Remove Button */}
                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    className="w-10 h-10 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="card bg-zinc-900">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-lg text-zinc-400">Celkem</span>
                            <span className="text-3xl font-bold text-emerald-400">
                                {total.toLocaleString('cs-CZ')} Kč
                            </span>
                        </div>
                        
                        <button 
                            onClick={submitOrder}
                            disabled={loading}
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 text-lg font-bold rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:hover:scale-100"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Zpracovávám...
                                </span>
                            ) : 'Odeslat objednávku'}
                        </button>
                        
                        <p className="text-center text-zinc-600 text-sm mt-4">
                            Objednávka se vytvoří jako transakce přes více tabulek
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
