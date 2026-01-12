# Test Case T001 - Instalace a spuštění

| Položka | Hodnota |
|---------|---------|
| Test number | T001 |
| Test name | Instalace a spuštění |
| Description | Instalace aplikace, konfigurace databáze a první spuštění |
| Prerequisite tests | žádné |
| Test creator | Robin Zajíček |
| Requirements tested | 1, 2, 3, 8, 9 |
| Creation date | 2026-01-12 |

---

## Kroky

### 1. Stažení projektu

1. Otevřete příkazový řádek (cmd nebo PowerShell)
2. Přejděte do požadované složky:
   ```
   cd C:\Projects
   ```
3. Naklonujte repozitář:
   ```
   git clone https://github.com/RobiNZajicek/basic_eshop_for_school.git
   cd basic_eshop_for_school/e-shop
   ```
4. **Očekávaný výsledek:** Projekt je stažen do složky `basic_eshop_for_school`

---

### 2. Import databázové struktury

1. Otevřete SQL Server Management Studio (SSMS)
2. Připojte se k databázovému serveru (např. `localhost\SQLEXPRESS` nebo školní server)
3. Vytvořte novou databázi:
   ```sql
   CREATE DATABASE eshop_db
   ```
4. Vyberte databázi a otevřete New Query
5. Spusťte skripty v tomto pořadí:
   - `src/sql/01_create_tables.sql`
   - `src/sql/02_create_views.sql`
   - `src/sql/03_seed_data.sql`

6. **Očekávaný výsledek:** Databáze obsahuje 5 tabulek a 2 pohledy

---

### 3. Konfigurace backendu

1. Přejděte do složky `e-shop`
2. Zkopírujte `.env.example` na `.env`:
   ```
   copy .env.example .env
   ```
3. Upravte `.env` soubor s vašimi údaji:
   ```
   DB_SERVER=localhost\SQLEXPRESS
   DB_NAME=eshop_db
   DB_USER=vase_jmeno
   DB_PASSWORD=vase_heslo
   DB_DRIVER=ODBC Driver 17 for SQL Server
   FLASK_DEBUG=True
   ```
4. **Očekávaný výsledek:** Soubor `.env` obsahuje správné přihlašovací údaje

---

### 4. Instalace Python závislostí

1. Otevřete terminál ve složce `e-shop`
2. Spusťte:
   ```
   pip install flask pyodbc python-dotenv flask-cors
   ```
3. **Očekávaný výsledek:** Všechny balíčky jsou nainstalovány bez chyb

---

### 5. Spuštění backendu

1. Přejděte do složky backend:
   ```
   cd src/backend
   ```
2. Spusťte:
   ```
   python app.py
   ```
3. **Očekávaný výsledek:** V terminálu se zobrazí:
   ```
   ==================================================
   E-SHOP API SERVER
   ==================================================
   Server: http://127.0.0.1:5000
   ==================================================
   * Running on http://127.0.0.1:5000
   ```

---

### 6. Ověření API health

1. Otevřete webový prohlížeč
2. Přejděte na: `http://localhost:5000/api/health`
3. **Očekávaný výsledek:** Zobrazí se JSON:
   ```json
   {"status": "ok", "database": "connected"}
   ```

---

### 7. Instalace frontend závislostí

1. Otevřete NOVÝ terminál (backend musí běžet!)
2. Přejděte do složky `e-shop`
3. Spusťte:
   ```
   npm install
   ```
4. **Očekávaný výsledek:** Závislosti jsou nainstalovány (může trvat 1-3 minuty)

---

### 8. Spuštění frontendu

1. Ve složce `e-shop` spusťte:
   ```
   npm run dev
   ```
2. **Očekávaný výsledek:** V terminálu se zobrazí:
   ```
   ▲ Next.js 16.x.x
   - Local: http://localhost:3000
   ```

---

### 9. Ověření aplikace

1. Otevřete prohlížeč na `http://localhost:3000`
2. **Očekávaný výsledek:** Zobrazí se hlavní stránka e-shopu s produkty

---

### 10. Test chybné konfigurace

1. Zastavte backend (CTRL+C)
2. V `.env` změňte heslo na nesprávné
3. Spusťte backend znovu: `python app.py`
4. **Očekávaný výsledek:** V terminálu se zobrazí chybová hláška o selhání připojení k databázi
5. Vraťte správné heslo do `.env`

---

## Shrnutí testu

| Krok | Popis | Status |
|------|-------|--------|
| 1 | Stažení projektu | ☐ |
| 2 | Import databáze | ☐ |
| 3 | Konfigurace `.env` | ☐ |
| 4 | Instalace Python | ☐ |
| 5 | Spuštění backendu | ☐ |
| 6 | API health check | ☐ |
| 7 | Instalace NPM | ☐ |
| 8 | Spuštění frontendu | ☐ |
| 9 | Ověření UI | ☐ |
| 10 | Test chybné konfigurace | ☐ |

---

**Poznámky testera:**

_____________________________________________________________

_____________________________________________________________

_____________________________________________________________
