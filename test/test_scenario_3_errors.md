# Test Case T003 - Testování chybových stavů

| Položka | Hodnota |
|---------|---------|
| Test number | T003 |
| Test name | Testování chybových stavů |
| Description | Ověření správného zpracování chyb |
| Prerequisite tests | T001 |
| Test creator | Robin Zajíček |
| Requirements tested | 10 |
| Creation date | 2026-01-12 |

---

## Prerekvizity

- Backend běží na `http://localhost:5000`
- Frontend běží na `http://localhost:3000`

---

## Kroky

### 1. Neexistující produkt

1. Otevřete: `http://localhost:5000/api/products/99999`
2. **Očekávaný výsledek:** 
   - HTTP status: 404
   - JSON: `{"error": "Product not found"}`

---

### 2. Neplatný JSON při importu

1. Na `/admin` v sekci Import vložte:
   ```
   toto neni validni json
   ```
2. Klikněte "Importovat"
3. **Očekávaný výsledek:** Zobrazí se chybová hláška o neplatném JSON

---

### 3. Prázdný košík - vytvoření objednávky

1. Ujistěte se, že košík je prázdný
2. Zkuste vytvořit objednávku
3. **Očekávaný výsledek:** Zobrazí se hláška "Košík je prázdný"

---

### 4. Nedostatek na skladě

1. Najděte produkt s malým množstvím na skladě (např. stock = 2)
2. Zkuste přidat do košíku více kusů než je skladem
3. **Očekávaný výsledek:** Zobrazí se hláška o nedostatku zásob

---

### 5. Chybné přihlašovací údaje k databázi

1. Zastavte backend (CTRL+C)
2. V `.env` změňte `DB_PASSWORD` na nesprávnou hodnotu
3. Spusťte backend: `python app.py`
4. Otevřete: `http://localhost:5000/api/health`
5. **Očekávaný výsledek:**
   - JSON: `{"status": "error", "message": "Login failed..."}`
6. Vraťte správné heslo a restartujte backend

---

### 6. Chybějící povinné pole při vytváření produktu

1. Použijte Postman nebo curl:
   ```
   POST http://localhost:5000/api/products
   Content-Type: application/json
   
   {"name": "Test"}
   ```
   (chybí price, category_id)
2. **Očekávaný výsledek:**
   - HTTP status: 400
   - JSON s popisem chybějících polí

---

### 7. Backend neběží

1. Zastavte backend (CTRL+C)
2. Obnovte frontend stránku
3. **Očekávaný výsledek:** Frontend zobrazí chybovou hlášku "Nelze se připojit k serveru" nebo podobnou

---

### 8. Neplatná kategorie při vytváření produktu

1. Použijte Postman nebo curl:
   ```
   POST http://localhost:5000/api/products
   Content-Type: application/json
   
   {
     "name": "Test",
     "price": 100,
     "category_id": 99999
   }
   ```
2. **Očekávaný výsledek:**
   - HTTP status: 400 nebo 404
   - Chybová hláška o neexistující kategorii

---

### 9. SQL Injection test

1. Otevřete: `http://localhost:5000/api/products?search='; DROP TABLE products;--`
2. **Očekávaný výsledek:** 
   - Žádná chyba
   - Tabulka products stále existuje (použijte SELECT * FROM products v SSMS)

---

### 10. Velký objem dat

1. Vytvořte JSON s 100+ produkty pro import
2. Importujte přes `/admin`
3. **Očekávaný výsledek:** Import proběhne úspěšně (může trvat déle)

---

## Shrnutí testu

| Krok | Popis | Status |
|------|-------|--------|
| 1 | Neexistující produkt | ☐ |
| 2 | Neplatný JSON | ☐ |
| 3 | Prázdný košík | ☐ |
| 4 | Nedostatek skladu | ☐ |
| 5 | Chybné DB přihlášení | ☐ |
| 6 | Chybějící pole | ☐ |
| 7 | Backend neběží | ☐ |
| 8 | Neplatná kategorie | ☐ |
| 9 | SQL Injection | ☐ |
| 10 | Velký objem dat | ☐ |

---

**Poznámky testera:**

_____________________________________________________________

_____________________________________________________________

_____________________________________________________________
