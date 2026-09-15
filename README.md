# GIT Logistics

Shipment tracking MVP: React frontend + Laravel API (Sanctum).

## Quick start

### Backend

```powershell
cd backend
composer install
copy .env.example .env   # if needed
php artisan key:generate
# ensure database/database.sqlite exists for sqlite
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8010
```

API base: `http://127.0.0.1:8010/api/v1`

Demo login: `ops@gitlogistics.ng` / `password`

### Frontend

```powershell
cd frontend
npm install
```

In `frontend/.env`:

```env
VITE_USE_LOCAL_STORAGE=false
VITE_API_BASE_URL=http://127.0.0.1:8010/api/v1
```

```powershell
npm run dev
```

Set `VITE_USE_LOCAL_STORAGE=true` to run without the API (browser localStorage demo).

## Features

- Public tracking by number
- Ops login (Sanctum token)
- Create shipment
- Update status with allowed transitions
- Dashboard stats + search/filter
- Export shipments JSON

## Status flow

`ORDER_CREATED` → `PICKED_UP` → `AT_ORIGIN_HUB` → `IN_TRANSIT` → `AT_DESTINATION_HUB` → `OUT_FOR_DELIVERY` → `DELIVERED`

Also supported: `DELIVERY_ATTEMPTED`, `RETURNED`, `CANCELLED` (where allowed).

## Tests

```powershell
cd backend
php artisan test
```

```powershell
cd frontend
npm run build
npm run lint
```
