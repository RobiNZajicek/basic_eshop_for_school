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

**2.1 Otevření SSMS:**
1. Stiskněte Windows + S
2. Napište "SQL Server Management Studio"
3. Otevřete aplikaci (může chvíli trvat)

**2.2 Připojení k serveru:**
Po spuštění se automaticky objeví okénko "Connect to Server".

| Pole | Co tam napsat |
|------|---------------|
| Server type | Database Engine (již předvyplněno) |
| Server name | NÁZEV VAŠEHO PC (viz níže) |
| Authentication | SQL Server Authentication |
| Login | sa |
| Password | student |

**Jak zjistit název PC:**
- Windows + Pause/Break → Název zařízení
- NEBO pravý klik na "Tento počítač" → Vlastnosti

**Alternativní Server names (pokud název PC nefunguje):**
- localhost
- localhost\SQLEXPRESS
- .\SQLEXPRESS

Klikněte "Connect"

**2.3 Vytvoření databáze:**
1. Pravý klik na "Databases" → "New Database..."
2. Database name: `eshop_db`
3. OK

**2.4 Spuštění SQL skriptů:**
1. Klikněte na databázi `eshop_db`
2. Klikněte "New Query" (nebo Ctrl+N)
3. Spusťte skripty v tomto pořadí:
   - `src/sql/01_create_tables.sql` → Execute (F5)
   - `src/sql/02_create_views.sql` → Execute (F5)
   - `src/sql/03_seed_data.sql` → Execute (F5)

4. **Očekávaný výsledek:** Databáze obsahuje 5 tabulek a 2 pohledy

---

### 3. Konfigurace backendu

1. Přejděte do složky `e-shop`
2. Zkopírujte `.env.example` na `.env`:
   ```
   copy .env.example .env
   ```
3. Upravte `.env` soubor (standardní školní nastavení):
   ```
   DB_SERVER=NAZEV-VASEHO-PC
   DB_NAME=eshop_db
   DB_USER=sa
   DB_PASSWORD=student
   DB_DRIVER=ODBC Driver 17 for SQL Server
   ```
   
   **Příklad** (pokud se PC jmenuje PC-UCEBNA01):
   ```
   DB_SERVER=PC-UCEBNA01
   DB_NAME=eshop_db
   DB_USER=sa
   DB_PASSWORD=student
   DB_DRIVER=ODBC Driver 17 for SQL Server
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
