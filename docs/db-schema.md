# DB 스키마

DB: Aurora DSQL (`postgres` 데이터베이스, `public` 스키마). 앱은 테이블을 자동 생성하지 않습니다. 배포 후 아래 DDL을 직접 실행합니다.

## users

| 컬럼 | 타입 | 제약 / 기본값 | 설명 |
|---|---|---|---|
| `id` | `UUID` | PK, `DEFAULT gen_random_uuid()` | 앱 사용자 ID (앱 JWT의 `sub`) |
| `google_sub` | `VARCHAR(255)` | `NOT NULL`, `UNIQUE` | 구글 ID 토큰의 `sub` |
| `email` | `VARCHAR(320)` | `NOT NULL` | 구글 이메일 (로그인 시 갱신) |
| `name` | `VARCHAR(255)` | `NOT NULL` | 구글 표시 이름 (로그인 시 갱신) |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT CURRENT_TIMESTAMP` | 최초 가입 시각 |

로그인 시 `INSERT ... ON CONFLICT (google_sub) DO UPDATE`로 upsert합니다.

### DDL

DSQL은 한 트랜잭션에 DDL 1개만 허용하므로 단독으로 실행합니다.

```sql
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_sub VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(320) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```
