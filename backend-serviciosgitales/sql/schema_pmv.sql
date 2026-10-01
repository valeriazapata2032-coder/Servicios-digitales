-- Innova Digital — esquema base PMV (MySQL Clever Cloud)
-- Ejecutar en el consola SQL del add-on o con cliente MySQL

CREATE TABLE IF NOT EXISTS roles (
  id_rol INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  id_rol INT NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  telefono VARCHAR(30) NULL,
  canal_contacto ENUM('whatsapp','correo','instagram') DEFAULT 'whatsapp',
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

CREATE TABLE IF NOT EXISTS categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  activa BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS servicios (
  id_servicio INT AUTO_INCREMENT PRIMARY KEY,
  id_vendedor INT NOT NULL,
  id_categoria INT NOT NULL,
  titulo VARCHAR(180) NOT NULL,
  descripcion TEXT NOT NULL,
  precio_base DECIMAL(12,2) NOT NULL,
  dias_entrega INT NOT NULL DEFAULT 7,
  estado ENUM('pendiente','aprobado','pausado','rechazado') NOT NULL DEFAULT 'pendiente',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_vendedor) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

CREATE TABLE IF NOT EXISTS paquetes_servicio (
  id_paquete INT AUTO_INCREMENT PRIMARY KEY,
  id_servicio INT NOT NULL,
  nombre VARCHAR(80) NOT NULL,
  precio DECIMAL(12,2) NOT NULL,
  dias_entrega INT NOT NULL,
  FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pedidos (
  id_pedido INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT NOT NULL,
  id_vendedor INT NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  estado ENUM('pendiente','en_proceso','entregado','ajustes','cerrado','cancelado') NOT NULL DEFAULT 'pendiente',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_vendedor) REFERENCES usuarios(id_usuario)
);

CREATE TABLE IF NOT EXISTS briefings (
  id_briefing INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT NOT NULL UNIQUE,
  nombre_negocio VARCHAR(180) NOT NULL,
  objetivos TEXT,
  publico_objetivo TEXT,
  redes_actuales TEXT,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS encuestas (
  id_encuesta INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(180) NOT NULL,
  estado ENUM('borrador','publicada','cerrada') NOT NULL DEFAULT 'borrador',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO roles (id_rol, nombre) VALUES
  (1, 'administrador'),
  (2, 'vendedor'),
  (3, 'cliente');

INSERT IGNORE INTO categorias (nombre) VALUES
  ('Redes sociales'),
  ('Diseño gráfico'),
  ('Edición de video'),
  ('Creación de contenido'),
  ('Páginas web'),
  ('Publicidad en línea'),
  ('Asesoría digital');
