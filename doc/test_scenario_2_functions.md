# Test Case T002

| Položka | Hodnota |
|---------|---------|
| **Test number** | T002 |
| **Test name** | Funkční testování |
| **Description** | Test hlavních funkcí včetně CRUD operací a transakcí |
| **Prerequisite tests** | T001 |
| **Test creator** | Robin Zajíček |
| **Requirements tested** | 4, 5, 6, 7 |
| **Creation date** | 2026-01-12 |

---

## Kroky

### 1. Zobrazení produktů
1. Otevřete `http://localhost:3000`.
2. Klikněte na "Produkty" v navigaci.
3. **Očekávaný výsledek:** Zobrazí se seznam všech produktů z databáze.

### 2. Detail produktu
1. Klikněte na libovolný produkt.
2. **Očekávaný výsledek:** Zobrazí se detail produktu s názvem, cenou, popisem a skladem.

### 3. Přidání produktu do košíku
1. Na stránce produktů klikněte "Přidat do košíku" u produktu.
2. Přejděte do košíku (ikona v navigaci).
3. **Očekávaný výsledek:** Produkt je v košíku se správnou cenou a množstvím.

### 4. Úprava množství v košíku
1. V košíku změňte množství produktu pomocí +/- tlačítek.
2. **Očekávaný výsledek:** Množství a celková cena se aktualizují.

### 5. Vytvoření objednávky (TRANSAKCE přes více tabulek)
1. V košíku klikněte "Objednat".
2. Zadejte User ID (např. 1).
3. Klikněte "Potvrdit objednávku".
4. **Očekávaný výsledek:** 
   - Objednávka je vytvořena.
   - V databázi jsou záznamy v tabulkách `orders` a `order_items`.
   - Sklad produktů (`products.stock`) je snížen.

### 6. Ověření transakce v databázi
1. V SSMS spusťte:
   ```sql
   SELECT * FROM orders ORDER BY id DESC;
   SELECT * FROM order_items ORDER BY id DESC;
   SELECT id, name, stock FROM products;
   ```
2. **Očekávaný výsledek:** Nová objednávka existuje, položky jsou přiřazeny, sklad snížen.

### 7. Admin panel - zobrazení reportu (agregovaná data ze 3+ tabulek)
1. Přejděte na `http://localhost:3000/admin`.
2. Zobrazte sekci "Report".
3. **Očekávaný výsledek:** Report zobrazuje:
   - Celkový počet produktů
   - Celkový počet objednávek
   - Celkové tržby
   - Průměrnou hodnotu objednávky
   - Nejprodávanější produkty

### 8. Admin panel - správa produktů (CRUD)
1. V admin panelu přejděte na "Správa produktů".

#### 8a. Vytvoření produktu (CREATE)
1. Vyplňte formulář: Název, Popis, Cena, Sklad, Kategorie.
2. Klikněte "Přidat produkt".
3. **Očekávaný výsledek:** Produkt se objeví v seznamu.

#### 8b. Úprava produktu (UPDATE)
1. U existujícího produktu klikněte "Upravit".
2. Změňte cenu nebo název.
3. Klikněte "Uložit".
4. **Očekávaný výsledek:** Změny jsou uloženy a zobrazeny.

#### 8c. Smazání produktu (DELETE)
1. U produktu klikněte "Smazat".
2. Potvrďte smazání.
3. **Očekávaný výsledek:** Produkt zmizí ze seznamu.

### 9. Import dat z JSON (2 tabulky)
1. V admin panelu přejděte na "Import dat".
2. Připravte JSON soubor pro produkty:
   ```json
   [
     {"name": "Test Produkt", "description": "Popis", "price": 199.99, "stock": 50, "category_id": 1}
   ]
   ```
3. Nahrajte soubor a klikněte "Importovat produkty".
4. **Očekávaný výsledek:** Produkty jsou importovány do databáze.

5. Připravte JSON soubor pro kategorie:
   ```json
   [
     {"name": "Nová Kategorie", "description": "Popis kategorie"}
   ]
   ```
6. Nahrajte a importujte.
7. **Očekávaný výsledek:** Kategorie jsou importovány.

### 10. Převod kreditů (TRANSAKCE)
1. Přejděte na endpoint (nebo použijte Postman/curl):
   ```
   POST http://localhost:5000/api/users/transfer-credits
   Body: {"from_user_id": 1, "to_user_id": 2, "amount": 100}
   ```
2. **Očekávaný výsledek:** 
   - Kredity jsou odečteny z uživatele 1.
   - Kredity jsou přičteny uživateli 2.
   - Operace je atomická (buď proběhne celá, nebo vůbec).

---

## Shrnutí testu

| Krok | Funkce | Requirements | Status |
|------|--------|--------------|--------|
| 1-2 | Zobrazení produktů | 4 | ☐ |
| 3-4 | Košík | 4 | ☐ |
| 5-6 | Vytvoření objednávky (TRANSAKCE) | 4, 5 | ☐ |
| 7 | Agregovaný report | 6 | ☐ |
| 8 | CRUD produkty | 4 | ☐ |
| 9 | Import JSON | 7 | ☐ |
| 10 | Převod kreditů (TRANSAKCE) | 5 | ☐ |
