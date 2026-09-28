-- VELA POS V1 schema
--
-- branch_id note: V1 does not implement multi-branch UI/logic, but every core
-- business table below carries a branch_id column (defaulted to a single
-- placeholder branch) so a future branches table + FK can be added without an
-- expensive retrofit. Line items (sale_item), payments, and app_user are not
-- independently branch-tagged — they inherit branch scope from their parent
-- sale/staff record.

-- ============================================================
-- customer
-- ============================================================
CREATE TABLE customer (
    id              UUID PRIMARY KEY,
    full_name       VARCHAR(255) NOT NULL,
    mobile          VARCHAR(30)  NOT NULL,
    email           VARCHAR(255),
    loyalty_points  INTEGER      NOT NULL DEFAULT 0,
    branch_id       UUID         NOT NULL DEFAULT '11111111-1111-1111-1111-111111111111',
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_customer_mobile ON customer (mobile);

-- ============================================================
-- staff
-- ============================================================
CREATE TABLE staff (
    id          UUID PRIMARY KEY,
    full_name   VARCHAR(255) NOT NULL,
    role        VARCHAR(100) NOT NULL,
    contact     VARCHAR(100),
    active      BOOLEAN      NOT NULL DEFAULT true,
    branch_id   UUID         NOT NULL DEFAULT '11111111-1111-1111-1111-111111111111',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_staff_active ON staff (active);

-- ============================================================
-- salon_service (service catalog)
-- ============================================================
CREATE TABLE salon_service (
    id               UUID PRIMARY KEY,
    name             VARCHAR(255)   NOT NULL,
    category         VARCHAR(50)    NOT NULL CHECK (category IN ('HAIR', 'NAIL', 'SPA', 'AESTHETIC')),
    duration_min     INTEGER        NOT NULL,
    price            NUMERIC(12, 2) NOT NULL,
    commission_rate  NUMERIC(5, 2)  NOT NULL,
    branch_id        UUID           NOT NULL DEFAULT '11111111-1111-1111-1111-111111111111',
    created_at       TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_salon_service_category ON salon_service (category);

-- ============================================================
-- appointment
-- ============================================================
CREATE TABLE appointment (
    id           UUID PRIMARY KEY,
    customer_id  UUID        NOT NULL REFERENCES customer (id),
    staff_id     UUID        NOT NULL REFERENCES staff (id),
    service_id   UUID        NOT NULL REFERENCES salon_service (id),
    start_time   TIMESTAMPTZ NOT NULL,
    status       VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                 CHECK (status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
    branch_id    UUID        NOT NULL DEFAULT '11111111-1111-1111-1111-111111111111',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_appointment_start_time ON appointment (start_time);
CREATE INDEX idx_appointment_staff_start_time ON appointment (staff_id, start_time);

-- ============================================================
-- sale (POS invoice)
-- ============================================================
CREATE TABLE sale (
    id               UUID PRIMARY KEY,
    invoice_number   VARCHAR(50)    NOT NULL UNIQUE,
    customer_id      UUID           REFERENCES customer (id),
    cashier_id       UUID           NOT NULL REFERENCES staff (id),
    subtotal         NUMERIC(12, 2) NOT NULL,
    discount_amount  NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tax_amount       NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_amount     NUMERIC(12, 2) NOT NULL,
    status           VARCHAR(10)    NOT NULL DEFAULT 'PAID' CHECK (status IN ('PAID', 'VOID')),
    branch_id        UUID           NOT NULL DEFAULT '11111111-1111-1111-1111-111111111111',
    created_at       TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_sale_created_at ON sale (created_at);

-- ============================================================
-- sale_item
-- ============================================================
CREATE TABLE sale_item (
    id           UUID PRIMARY KEY,
    sale_id      UUID           NOT NULL REFERENCES sale (id) ON DELETE CASCADE,
    service_id   UUID           NOT NULL REFERENCES salon_service (id),
    description  VARCHAR(255)   NOT NULL,
    quantity     INTEGER        NOT NULL,
    unit_price   NUMERIC(12, 2) NOT NULL,
    line_total   NUMERIC(12, 2) NOT NULL
);

CREATE INDEX idx_sale_item_sale_id ON sale_item (sale_id);

-- ============================================================
-- payment
-- ============================================================
CREATE TABLE payment (
    id          UUID PRIMARY KEY,
    sale_id     UUID           NOT NULL REFERENCES sale (id) ON DELETE CASCADE,
    method      VARCHAR(10)    NOT NULL CHECK (method IN ('CASH', 'CARD')),
    amount      NUMERIC(12, 2) NOT NULL,
    created_at  TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_payment_sale_id ON payment (sale_id);

-- ============================================================
-- app_user (login credentials, separate from the Staff business entity)
-- ============================================================
CREATE TABLE app_user (
    id             UUID PRIMARY KEY,
    username       VARCHAR(100) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    role           VARCHAR(20)  NOT NULL CHECK (role IN ('ADMIN', 'STAFF')),
    staff_id       UUID         REFERENCES staff (id)
);
