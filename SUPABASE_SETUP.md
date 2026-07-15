# Supabase setup

## 1. Create table

Supabase Dashboard > SQL Editor > New query에서 아래 SQL을 실행합니다.

```sql
create table if not exists public.applications (
  id uuid primary key,
  created_at timestamptz not null default now(),
  cohort text,
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

create table if not exists public.students (
  id uuid primary key,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null unique,
  role text not null default 'student',
  status text not null default 'active',
  source_application_id uuid references public.applications(id)
);

alter table public.students enable row level security;
```

이미 `applications` 테이블을 만든 뒤라면, 아래 SQL만 한 번 더 실행하면 됩니다.

```sql
alter table public.applications
add column if not exists cohort text;
```

관리자 페이지에서 `수강생으로 승인`을 누르려면 아래 `students` 테이블도 필요합니다. 승인 버튼에서 서버 오류가 나면 이 SQL을 먼저 실행해주세요.

```sql
create table if not exists public.students (
  id uuid primary key,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null unique,
  role text not null default 'student',
  status text not null default 'active',
  source_application_id uuid references public.applications(id)
);

alter table public.students enable row level security;
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
SOLAPI_ADMIN_TO=운영자가 알림 받을 번호, 미입력 시 SOLAPI_FROM과 동일
NEXT_PUBLIC_SITE_URL=https://배포주소
```

`SUPABASE_SERVICE_ROLE_KEY`는 브라우저에 노출하면 안 됩니다. 이 프로젝트에서는 서버 코드에서만 사용합니다.

`SOLAPI_FROM`은 Solapi에 등록/승인된 발신번호여야 합니다. 신청서 제출자 연락처로 접수 완료 문자가 발송되고, 운영자 번호로 새 신청 알림 문자가 발송됩니다. 번호는 `01012345678`처럼 숫자만 넣는 형식을 권장합니다.

`SOLAPI_ADMIN_TO`를 비워두면 발신번호와 같은 번호로 운영자 알림이 갑니다. 관리자 문자에는 `/admin?key=...` 지원서 확인 링크가 포함됩니다.

## 3. Check pages

- Landing: `/`
- Apply: `/apply`
- Admin: `/admin?key=ADMIN_KEY값`
- Login: `/login`
- Student portal: `/portal`
