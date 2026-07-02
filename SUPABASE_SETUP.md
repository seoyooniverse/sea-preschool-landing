# Supabase setup

## 1. Create table

Supabase Dashboard > SQL Editor > New query에서 아래 SQL을 실행합니다.

```sql
create table if not exists public.applications (
  id uuid primary key,
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text not null,
  school text,
  major text,
  status text not null,
  interest text not null,
  goal text not null,
  motivation text not null,
  referral text,
  depositor text not null,
  agreed boolean not null default false
);

alter table public.applications enable row level security;
```

## 2. Environment variables

Vercel > Project > Settings > Environment Variables에 아래 값을 추가합니다.

```txt
SUPABASE_URL=Supabase Project URL
SUPABASE_SERVICE_ROLE_KEY=Supabase service_role key
ADMIN_KEY=관리자페이지비밀번호
SOLAPI_API_KEY=Solapi API key
SOLAPI_API_SECRET=Solapi API secret
SOLAPI_FROM=Solapi에 등록된 발신번호
SOLAPI_TO=신청 알림을 받을 운영자 휴대폰번호
```

`SUPABASE_SERVICE_ROLE_KEY`는 브라우저에 노출하면 안 됩니다. 이 프로젝트에서는 서버 코드에서만 사용합니다.

`SOLAPI_FROM`은 Solapi에 등록/승인된 발신번호여야 합니다. 번호는 `01012345678`처럼 숫자만 넣는 형식을 권장합니다.

## 3. Check pages

- Landing: `/`
- Apply: `/apply`
- Admin: `/admin?key=ADMIN_KEY값`
