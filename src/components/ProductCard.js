'use client';
import Link from 'next/link';

export default function ProductCard({ product, onAddToCart }) {
    const inStock = product.stock > 0;
    
    return (
        <div className="group card hover:shadow-xl hover:shadow-emerald-500/5">
            {/* Product Image Placeholder */}
            <div className="aspect-square rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 mb-4 flex items-center justify-center overflow-hidden">
                <div className="w-16 h-16 rounded-full bg-zinc-700/50 group-hover:scale-110 transition-transform duration-500" />
            </div>
            
            {/* Product Info */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {product.name}
                </h3>
                
                <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold text-emerald-400">
                        {product.price.toLocaleString('cs-CZ')} Kč
                    </span>
                    <span className={`text-sm ${inStock ? 'text-zinc-500' : 'text-red-400'}`}>
                        {inStock ? `${product.stock} ks` : 'Vyprodáno'}
                    </span>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <Link 
                        href={`/products/${product.id}`}
                        className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-center text-sm font-medium rounded-lg border border-zinc-700 transition-all duration-200"
                    >
                        Detail
                    </Link>
                    <button 
                        onClick={() => onAddToCart(product)}
                        disabled={!inStock}
                        className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
                    >
                        {inStock ? 'Do košíku' : 'Vyprodáno'}
                    </button>
                </div>
            </div>
        </div>
    );
}
