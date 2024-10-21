DROP TABLE IF EXISTS sale_details;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;

DROP TYPE payment_method_type;
CREATE TYPE payment_method_type AS ENUM ('cash', 'credit_card', 'bank_transfer');

CREATE TABLE IF NOT EXISTS categories(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS products(
    id SERIAL PRIMARY KEY,
    request_id VARCHAR(10) NOT NULL,
    category_id INTEGER REFERENCES categories(id), 
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    stock INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS sales(
    id SERIAL PRIMARY KEY,
    request_id VARCHAR(10) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    payment_method payment_method_type NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS sale_details(
    id SERIAL PRIMARY KEY,
    sale_id INTEGER REFERENCES sales(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal FLOAT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO categories (name, description) VALUES
('Bebidas calientes', 'Café, té y otras bebidas calientes'),
('Bebidas frías', 'Jugos, refrescos y bebidas frías'),
('Pasteles', 'Pasteles frescos y deliciosos'),
('Sandwiches', 'Variedad de sandwiches para todos los gustos'),
('Ensaladas', 'Ensaladas saludables y frescas'),
('Desayunos', 'Opciones deliciosas para empezar el día'),
('Snacks', 'Pequeños bocadillos para acompañar tu bebida'),
('Postres', 'Dulces para deleitar el paladar'),
('Café de especialidad', 'Cafés de origen único y blends exclusivos'),
('Empanadas', 'Empanadas con diferentes rellenos para disfrutar');


INSERT INTO products (name, description, price, stock, request_id, category_id) VALUES
('Latte', 'Café espresso con leche vaporizada', 45.00, 50, 'AB12CD34EF', 1),
('Cappuccino', 'Café con una espuma cremosa de leche', 50.00, 30, 'GH56IJ78KL', 3),
('Espresso', 'Café puro y concentrado', 30.00, 40, 'MN90OP12QR', 5),
('Té Chai', 'Té negro con especias y leche', 40.00, 20, 'ST34UV56WX', 2),
('Frappé de Mocha', 'Café frío con chocolate y crema batida', 55.00, 25, 'YZ78AB90CD', 7),
('Jugo de Naranja', 'Jugo fresco y natural de naranja', 35.00, 40, 'EF12GH34IJ', 4),
('Galleta de Chocolate', 'Galleta con trozos de chocolate', 15.00, 100, 'KL56MN78OP', 9),
('Brownie', 'Delicioso brownie de chocolate', 25.00, 60, 'QR90ST12UV', 6),
('Sandwich de Jamón y Queso', 'Clásico sandwich de jamón con queso derretido', 60.00, 35, 'WX34YZ56AB', 10),
('Ensalada César', 'Ensalada con pollo, lechuga, crutones y aderezo César', 70.00, 15, 'CD78EF90GH', 3),
('Croissant', 'Croissant de mantequilla recién horneado', 20.00, 50, 'IJ12KL34MN', 4),
('Tostadas con Aguacate', 'Pan tostado con aguacate fresco', 30.00, 40, 'OP56QR78ST', 1),
('Empanada de Pollo', 'Empanada rellena de pollo y especias', 35.00, 45, 'UV90WX12YZ', 6),
('Pastel de Zanahoria', 'Pastel húmedo de zanahoria con crema', 40.00, 20, 'AB34CD56EF', 8),
('Cheesecake', 'Pastel de queso cremoso con base de galleta', 50.00, 25, 'GH78IJ90KL', 2),
('Scone de Arándanos', 'Panecillo con arándanos frescos', 25.00, 30, 'MN12OP34QR', 5),
('Bagel con Queso Crema', 'Bagel tostado con queso crema', 35.00, 30, 'ST56UV78WX', 7),
('Café Americano', 'Café diluido con agua caliente', 35.00, 40, 'YZ90AB12CD', 9),
('Muffin de Vainilla', 'Muffin esponjoso de vainilla', 20.00, 40, 'EF34GH56IJ', 3),
('Panque de Plátano', 'Panque hecho con plátano maduro', 25.00, 30, 'KL78MN90OP', 8),
('Frappé de Fresa', 'Bebida fría de fresa con crema batida', 50.00, 25, 'QR12ST34UV', 2),
('Té Verde', 'Té refrescante y antioxidante', 30.00, 35, 'WX56YZ78AB', 6),
('Chocolate Caliente', 'Bebida caliente de chocolate', 40.00, 50, 'CD90EF12GH', 1),
('Medialuna', 'Pan dulce en forma de media luna', 18.00, 60, 'IJ34KL56MN', 4),
('Empanada de Carne', 'Empanada rellena de carne molida sazonada', 40.00, 40, 'OP78QR90ST', 10),
('Quiche de Espinacas', 'Tarta de huevo con espinacas y queso', 55.00, 15, 'UV12WX34YZ', 9),
('Té de Frutas', 'Infusión de frutas frescas', 35.00, 20, 'AB56CD78EF', 5),
('Batido de Mango', 'Bebida de mango fresca y natural', 45.00, 30, 'GH90IJ12KL', 3),
('Panini de Pavo', 'Panini relleno de pavo, queso y pesto', 60.00, 25, 'MN34OP56QR', 7),
('Churros', 'Postre frito espolvoreado con azúcar y canela', 20.00, 80, 'ST78UV90WX', 2),
('Café Cortado', 'Espresso con un toque de leche caliente', 32.00, 50, 'YZ12AB34CD', 5),
('Té de Manzanilla', 'Té calmante y relajante de manzanilla', 30.00, 40, 'EF56GH78IJ', 6),
('Frappé de Caramelo', 'Bebida fría con caramelo y crema batida', 50.00, 25, 'KL90MN12OP', 10),
('Ensalada de Frutas', 'Variedad de frutas frescas', 35.00, 25, 'QR34ST56UV', 1),
('Tarta de Limón', 'Tarta con base de galleta y relleno de limón', 45.00, 20, 'WX78YZ90AB', 4),
('Wrap de Pollo', 'Tortilla rellena de pollo, vegetales y aderezo', 55.00, 20, 'CD12EF34GH', 2),
('Chai Latte', 'Té chai con leche vaporizada', 45.00, 35, 'IJ56KL78MN', 8),
('Café Irlandés', 'Café con whisky y crema', 70.00, 10, 'OP90QR12ST', 9),
('Brownie con Nueces', 'Brownie con trozos de nueces', 30.00, 50, 'UV34WX56YZ', 7),
('Té Rojo', 'Infusión de té rojo, desintoxicante', 35.00, 30, 'AB78CD90EF', 4),
('Macchiato', 'Café espresso con un toque de leche espumada', 40.00, 40, 'GH12IJ34KL', 5),
('Panque de Nuez', 'Panque de nuez suave y esponjoso', 30.00, 25, 'MN56OP78QR', 10),
('Frappé de Cookies and Cream', 'Bebida fría con galletas y crema batida', 55.00, 20, 'ST90UV12WX', 8),
('Smoothie de Plátano', 'Bebida de plátano batida con leche', 50.00, 25, 'YZ34AB56CD', 9),
('Lemon Pie', 'Tarta de limón con merengue suave', 50.00, 20, 'EF78GH90IJ', 6),
('Empanada de Espinacas', 'Empanada rellena de espinacas y queso', 35.00, 30, 'KL12MN34OP', 3);
