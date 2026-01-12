# Test Case T002 - Testování funkcí

| Položka | Hodnota |
|---------|---------|
| Test number | T002 |
| Test name | Testování funkcí |
| Description | Ověření všech funkcionalit aplikace |
| Prerequisite tests | T001 |
| Test creator | Robin Zajíček |
| Requirements tested | 4, 5, 6, 7 |
| Creation date | 2026-01-12 |

---

## Prerekvizity

- Backend běží na `http://localhost:5000`
- Frontend běží na `http://localhost:3000`
- Databáze je naplněna testovacími daty

---

## Kroky

### 1. Zobrazení produktů

1. Otevřete `http://localhost:3000/products`
2. **Očekávaný výsledek:** Zobrazí se seznam všech produktů z databáze

---

### 2. Filtrování produktů podle kategorie

1. Na stránce produktů klikněte na kategorii (např. "Elektronika")
2. **Očekávaný výsledek:** Zobrazí se pouze produkty z vybrané kategorie

---

### 3. Přidání produktu do košíku

1. Na stránce produktů klikněte na tlačítko "Přidat do košíku" u libovolného produktu
2. Přejděte na `http://localhost:3000/cart`
3. **Očekávaný výsledek:** Produkt je v košíku se správnou cenou

---

### 4. Změna množství v košíku

1. V košíku změňte množství produktu pomocí tlačítek + / -
2. **Očekávaný výsledek:** Celková cena se přepočítá

---

### 5. Vytvoření objednávky

1. V košíku klikněte na "Vytvořit objednávku"
2. **Očekávaný výsledek:** 
   - Objednávka je vytvořena
   - Košík se vyprázdní
   - Zobrazí se potvrzení

---

### 6. Admin panel - zobrazení reportu

1. Přejděte na `http://localhost:3000/admin`
2. **Očekávaný výsledek:** Zobrazí se statistiky:
   - Celkový počet objednávek
   - Celkové tržby
   - Počet produktů
   - Počet uživatelů

---

### 7. Admin panel - import produktů

1. Na stránce `/admin` najděte sekci "Import produktů"
2. Vložte tento JSON:
   ```json
   [
     {
       "name": "Test Produkt",
       "price": 999,
       "description": "Testovací produkt",
       "category_id": 1,
       "stock": 10
     }
   ]
   ```
3. Klikněte na "Importovat"
4. **Očekávaný výsledek:** Produkt je přidán do databáze

---

### 8. Ověření importu

1. Přejděte na `http://localhost:3000/products`
2. **Očekávaný výsledek:** Nový produkt "Test Produkt" je v seznamu

---

### 9. API - přímý test endpointů

Otevřete v prohlížeči nebo použijte curl/Postman:

| Endpoint | Metoda | Očekávaný výsledek |
|----------|--------|-------------------|
| `/api/products` | GET | Seznam produktů (JSON) |
| `/api/categories` | GET | Seznam kategorií (JSON) |
| `/api/users` | GET | Seznam uživatelů (JSON) |
| `/api/orders` | GET | Seznam objednávek (JSON) |
| `/api/reports/summary` | GET | Statistiky (JSON) |

---

### 10. Test transakce - vytvoření objednávky

1. Poznamenejte si aktuální stav skladu produktu (stock)
2. Vytvořte objednávku s 2 kusy tohoto produktu
3. Zkontrolujte stav skladu v databázi nebo přes API
4. **Očekávaný výsledek:** Stock se snížil o 2

---

## Shrnutí testu

| Krok | Popis | Status |
|------|-------|--------|
| 1 | Zobrazení produktů | ☐ |
| 2 | Filtrování kategorií | ☐ |
| 3 | Přidání do košíku | ☐ |
| 4 | Změna množství | ☐ |
| 5 | Vytvoření objednávky | ☐ |
| 6 | Admin report | ☐ |
| 7 | Import produktů | ☐ |
| 8 | Ověření importu | ☐ |
| 9 | API endpointy | ☐ |
| 10 | Test transakce | ☐ |

---

**Poznámky testera:**

_____________________________________________________________

_____________________________________________________________

_____________________________________________________________
