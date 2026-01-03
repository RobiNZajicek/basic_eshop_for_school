# Technicka Dokumentace - E-Shop

**Projekt:** E-Shop  
**Oznaceni:** D1 - Repository Pattern  
**Autor:** zajicek3  
**Predmet:** Databaze  
**Rok:** 2026

---

## Obsah

1. [Popis projektu](#1-popis-projektu)
2. [Architektura systemu](#2-architektura-systemu)
3. [Databazove schema](#3-databazove-schema)
4. [Repository Pattern (D1)](#4-repository-pattern-d1)
5. [API Dokumentace](#5-api-dokumentace)
6. [Frontend](#6-frontend)
7. [Konfigurace](#7-konfigurace)
8. [Bezpecnost](#8-bezpecnost)
9. [Splneni pozadavku](#9-splneni-pozadavku)

---

## 1. Popis projektu

### 1.1 Ucel aplikace

E-Shop je webova aplikace pro spravovani internetoveho obchodu. Umoznuje:
- Prohlizeni a spravovani produktu
- Vytvareni objednavek
- Spravovani uzivatelu a jejich kreditu
- Generovani reportu a statistik
- Import dat z JSON formatu

### 1.2 Pouzite technologie

| Vrstva | Technologie |
|--------|-------------|
| Frontend | Next.js 16, React |
| Backend | Python 3.13, Flask |
| Databaze | Microsoft SQL Server |
| Komunikace | REST API, JSON |

### 1.3 Hlavni funkce

- CRUD operace nad produkty, kategoriemi, uzivateli
- Vytvareni objednavek (transakce pres vice tabulek)
- Prevod kreditu mezi uzivateli (transakce)
- Agregovany report z vice tabulek
- Import produktu a kategorii z JSON

---

## 2. Architektura systemu

### 2.1 Vrstvy aplikace

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND                                │
│                    (Next.js/React)                          │
│         localhost:3000                                       │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/JSON
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND                                 │
│                    (Flask API)                               │
│         localhost:5000                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────────────────────────┐    │
│  │   app.py    │───▶│       REPOSITORIES (D1)         │    │
│  │  (routes)   │    ├─────────────────────────────────┤    │
│  └─────────────┘    │  ProductRepository              │    │
│                     │  CategoryRepository             │    │
│                     │  UserRepository                 │    │
│                     │  OrderRepository                │    │
│                     └───────────────┬─────────────────┘    │
│                                     │                       │
│  ┌─────────────┐    ┌───────────────▼─────────────────┐    │
│  │  config.py  │───▶│        database.py              │    │
│  │   (.env)    │    │     (DB connection)             │    │
│  └─────────────┘    └───────────────┬─────────────────┘    │
│                                     │                       │
└─────────────────────────────────────┼───────────────────────┘
                                      │ pyodbc/ODBC
                                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE                                 │
│                  (SQL Server)                                │
├─────────────────────────────────────────────────────────────┤
│  Tabulky: users, categories, products, orders, order_items  │
│  Views: v_order_details, v_product_stats                    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Tok dat

1. Uzivatel interaguje s frontendem (prohlizec)
2. Frontend posila HTTP requesty na backend API
3. Backend zpracuje request pres prislusny endpoint
4. Endpoint vola metody z Repository
5. Repository provadi SQL dotazy pres Database tridu
6. Vysledky se vraci zpet ve formatu JSON

---

## 3. Databazove schema

### 3.1 ER Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │       │  categories  │       │   products   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ email        │       │ name         │       │ name         │
│ password_hash│       │ description  │       │ description  │
│ name         │       └──────┬───────┘       │ price        │
│ credits      │              │               │ stock        │
│ is_active    │              │ 1             │ category_id ─┼───┐
│ created_at   │              │               │ is_featured  │   │
└──────┬───────┘              │               │ created_at   │   │
       │                      │               └──────┬───────┘   │
       │ 1                    └───────────────────────┘          │
       │                                      M                   │
       │                                      │                   │
       │                      ┌───────────────┘                   │
       │                      │                                   │
┌──────▼───────┐       ┌──────▼───────┐                          │
│    orders    │       │ order_items  │                          │
├──────────────┤       ├──────────────┤                          │
│ id (PK)      │       │ id (PK)      │                          │
│ user_id (FK)─┼───────│ order_id (FK)│                          │
│ status       │   1   │ product_id ──┼──────────────────────────┘
│ total_price  │       │ quantity     │          M
│ created_at   │       │ unit_price   │
└──────────────┘       └──────────────┘

Vazby:
- users 1:N orders (uzivatel ma vice objednavek)
- categories 1:N products (kategorie obsahuje vice produktu)
- orders 1:N order_items (objednavka ma vice polozek)
- products M:N orders (produkt muze byt ve vice objednavkach)
  → reseno pres vazebni tabulku order_items
```

### 3.2 Popis tabulek

#### users
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | INT IDENTITY | Primarni klic |
| email | VARCHAR(255) UNIQUE | Email uzivatele |
| password_hash | VARCHAR(255) | Hashovane heslo |
| name | VARCHAR(100) | Jmeno uzivatele |
| credits | DECIMAL(10,2) | Kredit uzivatele |
| is_active | BIT | Aktivni ucet (0/1) |
| created_at | DATETIME | Datum vytvoreni |

#### categories
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | INT IDENTITY | Primarni klic |
| name | VARCHAR(100) | Nazev kategorie |
| description | TEXT | Popis kategorie |

#### products
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | INT IDENTITY | Primarni klic |
| name | VARCHAR(255) | Nazev produktu |
| description | TEXT | Popis produktu |
| price | DECIMAL(10,2) | Cena |
| stock | INT | Pocet na sklade |
| category_id | INT (FK) | ID kategorie |
| is_featured | BIT | Doporuceny produkt |
| created_at | DATETIME | Datum pridani |

#### orders
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | INT IDENTITY | Primarni klic |
| user_id | INT (FK) | ID uzivatele |
| status | VARCHAR(20) CHECK | Stav objednavky |
| total_price | DECIMAL(10,2) | Celkova cena |
| created_at | DATETIME | Datum vytvoreni |

**Povolene hodnoty status:** 'pending', 'paid', 'shipped', 'delivered'

#### order_items
| Sloupec | Typ | Popis |
|---------|-----|-------|
| id | INT IDENTITY | Primarni klic |
| order_id | INT (FK) | ID objednavky |
| product_id | INT (FK) | ID produktu |
| quantity | INT | Mnozstvi |
| unit_price | DECIMAL(10,2) | Cena v dobe nakupu |

### 3.3 Views

#### v_order_details
Zobrazuje objednavky s detaily polozek, zakaznika a produktu.
```sql
SELECT o.id, o.status, o.total_price, o.created_at,
       u.name, u.email, p.name, oi.quantity, oi.unit_price
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
```

#### v_product_stats
Zobrazuje produkty se statistikami prodeje.
```sql
SELECT p.id, p.name, c.name, p.price, p.stock,
       SUM(oi.quantity), SUM(oi.quantity * oi.unit_price)
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, c.name, p.price, p.stock
```

### 3.4 Datove typy

| Pozadavek | Datovy typ | Kde pouzito |
|-----------|------------|-------------|
| Realne cislo | DECIMAL(10,2) | price, credits, total_price |
| Logicka hodnota | BIT | is_active, is_featured |
| Vycet (enum) | VARCHAR + CHECK | status |
| Retezec | VARCHAR | name, email, description |
| Datum/cas | DATETIME | created_at |

---

## 4. Repository Pattern (D1)

### 4.1 Co je Repository Pattern

Repository pattern je navrhovy vzor, ktery zapouzdruje pristup k datum. Vytvari abstrakci mezi aplikaci a databazi.

**Princip:** Kazda tabulka ma svou Repository tridu, ktera obsahuje vsechny metody pro praci s daty.

### 4.2 Implementace

#### Hierarchie trid

```
BaseRepository (abstraktni)
    │
    ├── ProductRepository
    ├── CategoryRepository
    ├── UserRepository
    └── OrderRepository
```

#### BaseRepository

Obsahuje spolecne metody pro vsechny repository:

| Metoda | SQL | Popis |
|--------|-----|-------|
| get_all() | SELECT * FROM {table} | Vsechny zaznamy |
| get_by_id(id) | SELECT * WHERE id = ? | Jeden zaznam |
| delete(id) | DELETE WHERE id = ? | Smazani |
| count() | SELECT COUNT(*) | Pocet zaznamu |

#### ProductRepository

Dedi z BaseRepository + vlastni metody:

| Metoda | Popis |
|--------|-------|
| create() | Vytvori novy produkt |
| update() | Aktualizuje produkt |
| get_by_category() | Produkty podle kategorie |
| get_featured() | Doporucene produkty |
| update_stock() | Zmena stavu skladu |

#### UserRepository

| Metoda | Popis |
|--------|-------|
| create() | Registrace uzivatele |
| get_by_email() | Hledani podle emailu |
| update_credits() | Zmena kreditu |
| transfer_credits() | **TRANSAKCE** - prevod kreditu |

#### OrderRepository

| Metoda | Popis |
|--------|-------|
| create_order() | **TRANSAKCE** - vytvoreni objednavky (3 tabulky) |
| get_order_with_items() | Objednavka s polozkammi |
| get_user_orders() | Objednavky uzivatele |
| update_status() | Zmena stavu |

### 4.3 Transakce

#### transfer_credits()
```
BEGIN TRANSACTION
  1. UPDATE users SET credits = credits - amount WHERE id = from_user
  2. UPDATE users SET credits = credits + amount WHERE id = to_user
  3. IF error THEN ROLLBACK ELSE COMMIT
END TRANSACTION
```

#### create_order()
```
BEGIN TRANSACTION
  1. INSERT INTO orders (nova objednavka)
  2. FOR EACH item:
     a. INSERT INTO order_items
     b. UPDATE products SET stock = stock - quantity
  3. IF error THEN ROLLBACK ELSE COMMIT
END TRANSACTION
```

### 4.4 Vyhody Repository Pattern

1. **Oddeleni zodpovednosti** - SQL logika je oddelena od API
2. **Znovupouzitelnost** - metody lze volat z vice mist
3. **Testovatelnost** - lze snadno mockovat
4. **Udrzba** - zmeny SQL na jednom miste

---

## 5. API Dokumentace

### 5.1 Zakladni informace

- **Base URL:** `http://localhost:5000`
- **Format:** JSON
- **Autentizace:** Zadna (zjednoduseno pro skolni projekt)

### 5.2 Endpointy

#### Health Check

| Metoda | URL | Popis |
|--------|-----|-------|
| GET | /api/health | Stav API a databaze |

**Odpoved:**
```json
{"status": "ok", "database": "connected"}
```

#### Produkty

| Metoda | URL | Popis |
|--------|-----|-------|
| GET | /api/products | Seznam vsech produktu |
| GET | /api/products/{id} | Detail produktu |
| POST | /api/products | Vytvoreni produktu |
| PUT | /api/products/{id} | Uprava produktu |
| DELETE | /api/products/{id} | Smazani produktu |
| GET | /api/products/featured | Doporucene produkty |

**POST /api/products - telo:**
```json
{
  "name": "Nazev",
  "description": "Popis",
  "price": 999.00,
  "stock": 10,
  "category_id": 1,
  "is_featured": false
}
```

#### Kategorie

| Metoda | URL | Popis |
|--------|-----|-------|
| GET | /api/categories | Seznam kategorii |
| POST | /api/categories | Vytvoreni kategorie |
| GET | /api/categories/with-counts | Kategorie s poctem produktu |

#### Uzivatele

| Metoda | URL | Popis |
|--------|-----|-------|
| POST | /api/users | Registrace |
| GET | /api/users/{id} | Detail uzivatele |
| POST | /api/users/transfer-credits | Prevod kreditu |

**POST /api/users/transfer-credits:**
```json
{
  "from_user_id": 1,
  "to_user_id": 2,
  "amount": 100
}
```

#### Objednavky

| Metoda | URL | Popis |
|--------|-----|-------|
| POST | /api/orders | Vytvoreni objednavky |
| GET | /api/orders/{id} | Detail objednavky |
| PUT | /api/orders/{id}/status | Zmena stavu |
| GET | /api/users/{id}/orders | Objednavky uzivatele |

**POST /api/orders:**
```json
{
  "user_id": 1,
  "items": [
    {"product_id": 1, "quantity": 2, "unit_price": 299.00}
  ]
}
```

#### Report

| Metoda | URL | Popis |
|--------|-----|-------|
| GET | /api/report | Agregovana data |

**Odpoved:**
```json
{
  "total_revenue": 50000,
  "total_orders": 15,
  "total_users": 10,
  "avg_order_value": 3333.33,
  "top_products": [...],
  "category_sales": [...]
}
```

#### Import

| Metoda | URL | Popis |
|--------|-----|-------|
| POST | /api/import/products | Import produktu z JSON |
| POST | /api/import/categories | Import kategorii z JSON |

**POST /api/import/products:**
```json
{
  "products": [
    {"name": "...", "price": 100, "category_id": 1}
  ]
}
```

### 5.3 HTTP Status kody

| Kod | Vyznam |
|-----|--------|
| 200 | Uspech |
| 201 | Vytvoreno |
| 400 | Chybny pozadavek (validace) |
| 404 | Nenalezeno |
| 500 | Chyba serveru |

---

## 6. Frontend

### 6.1 Stranky

| URL | Komponenta | Popis |
|-----|------------|-------|
| / | page.js | Homepage, doporucene produkty |
| /products | products/page.js | Seznam produktu |
| /cart | cart/page.js | Nakupni kosik |
| /admin | admin/page.js | Admin panel, report |

### 6.2 Komponenty

| Komponenta | Popis |
|------------|-------|
| Navbar | Navigacni lista |
| ProductCard | Karta produktu |

### 6.3 API komunikace

Soubor `lib/api.js` obsahuje helper funkce:
- fetchAPI() - GET requesty
- postAPI() - POST requesty
- putAPI() - PUT requesty
- deleteAPI() - DELETE requesty

---

## 7. Konfigurace

### 7.1 Konfiguracni soubor

Aplikace pouziva `.env` soubor pro konfiguraci:

| Promenna | Popis | Vychozi |
|----------|-------|---------|
| DB_SERVER | Adresa SQL serveru | localhost |
| DB_NAME | Nazev databaze | eshop_db |
| DB_USER | Uzivatelske jmeno | - |
| DB_PASSWORD | Heslo | - |
| DB_DRIVER | ODBC driver | ODBC Driver 17 |
| FLASK_HOST | Adresa Flask | 127.0.0.1 |
| FLASK_PORT | Port Flask | 5000 |
| FLASK_DEBUG | Debug mod | True |

### 7.2 Nacitani konfigurace

1. `config.py` nacita promenne z `.env` pomoci `python-dotenv`
2. Pokud promenna chybi, pouzije se vychozi hodnota
3. Connection string se sestavuje dynamicky

---

## 8. Bezpecnost

### 8.1 Implementovano

- **Parametrizovane dotazy** - ochrana proti SQL injection
- **Validace vstupu** - kontrola povinnych poli
- **Hesla v .env** - citlive udaje mimo kod
- **.gitignore** - .env neni v repozitari

### 8.2 Zjednoduseno (skolni projekt)

- Bez autentizace (JWT/session)
- Hesla nejsou skutecne hashovana
- Bez HTTPS

---

## 9. Splneni pozadavku

### 9.1 Hlavni ukol D1

| Pozadavek | Splneno | Kde |
|-----------|---------|-----|
| Repository pattern | ✅ | src/backend/repositories/ |

### 9.2 Databazove pozadavky

| Pozadavek | Splneno | Kde |
|-----------|---------|-----|
| 5 tabulek | ✅ | users, categories, products, orders, order_items |
| 2 views | ✅ | v_order_details, v_product_stats |
| M:N vazba | ✅ | order_items |
| DECIMAL | ✅ | price, credits |
| BIT (bool) | ✅ | is_active, is_featured |
| CHECK (enum) | ✅ | status |
| VARCHAR | ✅ | name, email |
| DATETIME | ✅ | created_at |

### 9.3 Funkcni pozadavky

| Pozadavek | Splneno | Kde |
|-----------|---------|-----|
| CRUD vice tabulek | ✅ | OrderRepository.create_order() |
| Transakce | ✅ | transfer_credits(), create_order() |
| Report 3+ tabulek | ✅ | /api/report |
| Import JSON | ✅ | /api/import/* |
| Config soubor | ✅ | .env + config.py |
| Error handling | ✅ | Validace, try/catch |

### 9.4 Dokumentace

| Pozadavek | Splneno | Kde |
|-----------|---------|-----|
| README | ✅ | README.md |
| Dokumentace | ✅ | doc/DOKUMENTACE.md |
| Test scenar 1 | ✅ | doc/test_scenario_1_installation.md |
| Test scenar 2 | ✅ | doc/test_scenario_2_functions.md |
| Test scenar 3 | ✅ | doc/test_scenario_3_errors.md |

---

## Zaver

Tento projekt demonstruje implementaci Repository patternu (D1) v kontextu e-shopove aplikace. Vsechny pozadavky zadani byly splneny.

**Autor:** zajicek3  
**Datum:** 2026

