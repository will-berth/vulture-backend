DROP TABLE IS EXISTS sale_details;
DROP TABLE IS EXISTS sales;
DROP TABLE IS EXISTS products;
DROP TABLE IS EXISTS categories;

CREATE TYPE IF NOT EXISTS payment_method_type AS ENUM ('cash', 'credit_card', 'paypal', 'bank_transfer');

CREATE TABLE IF NOT EXISTS categories(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);
CREATE TABLE IF NOT EXISTS products(
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id), 
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    stock INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);
CREATE TABLE IF NOT EXISTS sales(
    id SERIAL PRIMARY KEY,
    date TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    payment_method payment_method_type NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);
CREATE TABLE IF NOT EXISTS sale_details(
    id SERIAL PRIMARY KEY,
    sale_id INTEGER REFERENCES sales(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal FLOAT NOT NULL
);