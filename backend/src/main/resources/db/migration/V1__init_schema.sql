-- Vedik Farm initial schema

CREATE TABLE users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(190) NOT NULL UNIQUE,
    password_hash   VARCHAR(100) NOT NULL,
    name            VARCHAR(150) NOT NULL,
    phone           VARCHAR(20),
    role            VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE addresses (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    label           VARCHAR(50),
    recipient_name  VARCHAR(150) NOT NULL,
    line1           VARCHAR(200) NOT NULL,
    line2           VARCHAR(200),
    city            VARCHAR(100) NOT NULL,
    state           VARCHAR(100) NOT NULL,
    pincode         VARCHAR(10) NOT NULL,
    phone           VARCHAR(20) NOT NULL,
    is_default      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE categories (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(120) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE products (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id     BIGINT,
    name            VARCHAR(200) NOT NULL,
    slug            VARCHAR(220) NOT NULL UNIQUE,
    description     TEXT,
    price           DECIMAL(10,2) NOT NULL,
    unit_label      VARCHAR(50),
    stock_qty       INT NOT NULL DEFAULT 0,
    image_url       VARCHAR(500),
    -- GST % applied to this product. Defaults to 0 on purpose: the correct rate
    -- depends on exact product classification (loose vs branded/packaged, HSN code)
    -- and must be set per-product by the admin after confirming with an accountant.
    gst_rate        DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);

CREATE TABLE cart_items (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    product_id      BIGINT NOT NULL,
    quantity        INT NOT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_items_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT uq_cart_user_product UNIQUE (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE orders (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number        VARCHAR(30) NOT NULL UNIQUE,
    user_id             BIGINT NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'PENDING_PAYMENT',

    subtotal            DECIMAL(10,2) NOT NULL,
    cgst_amount         DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    sgst_amount         DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    igst_amount         DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    shipping_fee        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total               DECIMAL(10,2) NOT NULL,

    -- Buyer's GSTIN, optional (only relevant for B2B orders wanting a tax invoice).
    buyer_gstin         VARCHAR(20),

    -- Shipping address snapshot at time of order (address book entry may change/be deleted later).
    ship_name           VARCHAR(150) NOT NULL,
    ship_phone          VARCHAR(20) NOT NULL,
    ship_line1          VARCHAR(200) NOT NULL,
    ship_line2          VARCHAR(200),
    ship_city           VARCHAR(100) NOT NULL,
    ship_state          VARCHAR(100) NOT NULL,
    ship_pincode        VARCHAR(10) NOT NULL,

    razorpay_order_id   VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature  VARCHAR(255),

    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TABLE order_items (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id        BIGINT NOT NULL,
    product_id      BIGINT,
    -- Snapshot fields: an order must not change retroactively if the product is later edited/deleted.
    product_name    VARCHAR(200) NOT NULL,
    unit_label      VARCHAR(50),
    unit_price      DECIMAL(10,2) NOT NULL,
    gst_rate        DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    quantity        INT NOT NULL,
    line_subtotal   DECIMAL(10,2) NOT NULL,
    line_gst        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    line_total      DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_order_items_order ON order_items(order_id);
