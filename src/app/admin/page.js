'use client';
import { useState, useEffect } from 'react';
import { getReport, getProducts, deleteProduct, importProducts } from '@/lib/api';

export default function AdminPage() {
    const [report, setReport] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [importData, setImportData] = useState('');
    const [importing, setImporting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [reportData, productsData] = await Promise.all([
                getReport(),
                getProducts()
            ]);
            setReport(reportData);
            setProducts(productsData);
        } catch (err) {
            console.error('Chyba:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Opravdu smazat tento produkt?')) return;
        try {
            await deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            alert('Chyba při mazání');
        }
    }

    async function handleImport() {
        setImporting(true);
        try {
            const data = JSON.parse(importData);
            const result = await importProducts(data);
            alert(result.message);
            loadData();
            setImportData('');
        } catch (err) {
            alert('Chyba při importu - zkontrolujte JSON formát');
        } finally {
            setImporting(false);
        }
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="animate-pulse space-y-8">
                    <div className="h-10 bg-zinc-800 rounded w-48" />
                    <div className="grid grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-zinc-800 rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-zinc-100 mb-3">Admin Panel</h1>
                <p className="text-zinc-500">Správa e-shopu, report a import dat</p>
            </div>

            {/* Report Section */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-100">Report</h2>
                        <p className="text-zinc-500 text-sm">Agregovaná data z 3+ tabulek</p>
                    </div>
                </div>
                
                {report && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="card">
                            <p className="text-zinc-500 text-sm mb-1">Celkové tržby</p>
                            <p className="text-2xl font-bold text-emerald-400">
                                {report.total_revenue?.toLocaleString('cs-CZ')} Kč
                            </p>
                        </div>
                        <div className="card">
                            <p className="text-zinc-500 text-sm mb-1">Objednávky</p>
                            <p className="text-2xl font-bold text-zinc-100">{report.total_orders}</p>
                        </div>
                        <div className="card">
                            <p className="text-zinc-500 text-sm mb-1">Uživatelé</p>
                            <p className="text-2xl font-bold text-zinc-100">{report.total_users}</p>
                        </div>
                        <div className="card">
                            <p className="text-zinc-500 text-sm mb-1">Průměrná objednávka</p>
                            <p className="text-2xl font-bold text-zinc-100">
                                {report.avg_order_value?.toFixed(0)} Kč
                            </p>
                        </div>
                    </div>
                )}

                {report?.top_products?.length > 0 && (
                    <div className="mt-6 card">
                        <h3 className="text-lg font-semibold text-zinc-100 mb-4">Top produkty</h3>
                        <div className="space-y-3">
                            {report.top_products.map((p, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <span className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-sm font-medium text-zinc-400">
                                        {i + 1}
                                    </span>
                                    <span className="flex-1 text-zinc-300">{p.name}</span>
                                    <span className="text-zinc-500">{p.sold}× prodáno</span>
                                    <span className="text-emerald-400 font-medium">{p.revenue?.toLocaleString('cs-CZ')} Kč</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Import Section */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-100">Import produktů</h2>
                        <p className="text-zinc-500 text-sm">Import z JSON formátu</p>
                    </div>
                </div>
                
                <div className="card">
                    <textarea
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        placeholder='{"products": [{"name": "Nový produkt", "price": 999, "category_id": 1, "stock": 10}]}'
                        rows={4}
                        className="input-field font-mono text-sm mb-4"
                    />
                    <button 
                        onClick={handleImport}
                        disabled={importing || !importData.trim()}
                        className="btn-primary disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {importing ? 'Importuji...' : 'Importovat'}
                    </button>
                </div>
            </section>

            {/* Products Table */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-100">Správa produktů</h2>
                        <p className="text-zinc-500 text-sm">{products.length} produktů v databázi</p>
                    </div>
                </div>
                
                <div className="card overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-800">
                                    <th className="text-left p-4 text-zinc-400 font-medium text-sm">ID</th>
                                    <th className="text-left p-4 text-zinc-400 font-medium text-sm">Název</th>
                                    <th className="text-left p-4 text-zinc-400 font-medium text-sm">Cena</th>
                                    <th className="text-left p-4 text-zinc-400 font-medium text-sm">Sklad</th>
                                    <th className="text-left p-4 text-zinc-400 font-medium text-sm">Featured</th>
                                    <th className="text-right p-4 text-zinc-400 font-medium text-sm">Akce</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                                        <td className="p-4 text-zinc-500 font-mono text-sm">{p.id}</td>
                                        <td className="p-4 text-zinc-100 font-medium">{p.name}</td>
                                        <td className="p-4 text-emerald-400">{p.price?.toLocaleString('cs-CZ')} Kč</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                                p.stock > 10 
                                                    ? 'bg-emerald-500/10 text-emerald-400' 
                                                    : p.stock > 0 
                                                        ? 'bg-yellow-500/10 text-yellow-400'
                                                        : 'bg-red-500/10 text-red-400'
                                            }`}>
                                                {p.stock} ks
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {p.is_featured ? (
                                                <span className="text-emerald-400">✓</span>
                                            ) : (
                                                <span className="text-zinc-600">−</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleDelete(p.id)}
                                                className="btn-danger text-sm"
                                            >
                                                Smazat
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}
