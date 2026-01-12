# Test Case T003

| Položka | Hodnota |
|---------|---------|
| **Test number** | T003 |
| **Test name** | Testování chyb |
| **Description** | Test ošetření chybových stavů a validace vstupů |
| **Prerequisite tests** | T001, T002 |
| **Test creator** | Robin Zajíček |
| **Requirements tested** | 9 |
| **Creation date** | 2026-01-12 |

---

## Kroky

### 1. Chybná konfigurace - špatné heslo k databázi
1. Zastavte backend.
2. V `.env` změňte `DB_PASSWORD` na nesprávnou hodnotu.
3. Spusťte backend: `python app.py`
4. **Očekávaný výsledek:** 
   - Backend vypíše chybovou hlášku: `Database connection failed: Login failed for user...`
   - Server se nespustí nebo vrací 500 na `/api/health`.

### 2. Chybná konfigurace - neexistující server
1. V `.env` změňte `DB_SERVER` na `neexistujici.server.cz`.
2. Spusťte backend.
3. **Očekávaný výsledek:** 
   - Backend vypíše: `Database connection failed: Unable to connect...`
   - Timeout po několika sekundách.

### 3. Chybná konfigurace - chybějící .env soubor
1. Přejmenujte `.env` na `.env.backup`.
2. Spusťte backend.
3. **Očekávaný výsledek:** 
   - Backend použije výchozí hodnoty nebo vypíše varování.
   - Aplikace se nespustí správně bez konfigurace.
4. Vraťte `.env` soubor zpět.

### 4. Validace vstupu - prázdný název produktu
1. V admin panelu zkuste vytvořit produkt s prázdným názvem.
2. **Očekávaný výsledek:** Zobrazí se chybová hláška "Název je povinný".

### 5. Validace vstupu - záporná cena
1. Zkuste vytvořit produkt s cenou -100.
2. **Očekávaný výsledek:** Zobrazí se chybová hláška "Cena musí být kladná".

### 6. Validace vstupu - neplatný JSON při importu
1. V admin panelu zkuste importovat soubor s neplatným JSON:
   ```
   {toto není platný json
   ```
2. **Očekávaný výsledek:** Zobrazí se chybová hláška "Neplatný formát JSON".

### 7. Chyba transakce - nedostatek skladu
1. Přidejte do košíku produkt.
2. Nastavte množství vyšší než je sklad (např. 9999).
3. Zkuste vytvořit objednávku.
4. **Očekávaný výsledek:** 
   - Zobrazí se chyba "Nedostatek skladu pro produkt X".
   - Transakce je rollbackována - žádná data nejsou uložena.

### 8. Chyba transakce - nedostatek kreditů
1. Zkuste převést více kreditů než má uživatel:
   ```
   POST /api/users/transfer-credits
   Body: {"from_user_id": 1, "to_user_id": 2, "amount": 999999}
   ```
2. **Očekávaný výsledek:** 
   - API vrátí chybu "Nedostatek kreditů".
   - Transakce je rollbackována - kredity zůstávají nezměněny.

### 9. Chyba - neexistující produkt
1. Zkuste přistoupit k neexistujícímu produktu:
   ```
   GET http://localhost:5000/api/products/99999
   ```
2. **Očekávaný výsledek:** API vrátí 404 s hláškou "Produkt nenalezen".

### 10. Chyba - neexistující uživatel při objednávce
1. Zkuste vytvořit objednávku s neexistujícím user_id:
   ```
   POST /api/orders
   Body: {"user_id": 99999, "items": [...]}
   ```
2. **Očekávaný výsledek:** API vrátí chybu "Uživatel nenalezen".

### 11. Chyba - neplatný formát dat
1. Pošlete request s neplatným formátem:
   ```
   POST /api/products
   Body: {"price": "není číslo"}
   ```
2. **Očekávaný výsledek:** API vrátí 400 s popisem chyby.

### 12. Frontend - backend nedostupný
1. Zastavte backend (CTRL+C).
2. Obnovte stránku frontendu.
3. **Očekávaný výsledek:** 
   - Frontend zobrazí uživatelsky přívětivou chybovou hlášku.
   - Nezobrazí se technická chyba nebo prázdná stránka.

### 13. Ověření rollbacku transakce
1. V SSMS poznamenejte si aktuální stav:
   ```sql
   SELECT id, stock FROM products WHERE id = 1;
   SELECT COUNT(*) FROM orders;
   ```
2. Vyvolejte chybu při vytváření objednávky (např. nedostatek skladu).
3. Znovu zkontrolujte stav v databázi.
4. **Očekávaný výsledek:** Data jsou nezměněna - rollback funguje.

---

## Shrnutí testu

| Krok | Typ chyby | Očekávané chování | Status |
|------|-----------|-------------------|--------|
| 1 | Konfigurace - heslo | Chybová hláška | ☐ |
| 2 | Konfigurace - server | Timeout + hláška | ☐ |
| 3 | Konfigurace - chybí .env | Varování/default | ☐ |
| 4-5 | Validace vstupu | Chybová hláška UI | ☐ |
| 6 | Neplatný JSON | Chybová hláška | ☐ |
| 7-8 | Transakce - rollback | Atomicita zachována | ☐ |
| 9-11 | API chyby | HTTP status + popis | ☐ |
| 12 | Nedostupný backend | Uživatelská hláška | ☐ |
| 13 | Ověření rollbacku | Data nezměněna | ☐ |

---

## Poznámky pro testera

- Před každým testem chyby se ujistěte, že aplikace funguje správně.
- Po testech vraťte konfiguraci do původního stavu.
- Při testování transakcí kontrolujte stav databáze před i po operaci.
- Všechny chyby by měly být zachyceny a zobrazeny uživatelsky přívětivě.
