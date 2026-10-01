-- =====================================================================
--  INNOVA DIGITAL · Plataforma web (PWA) de venta de servicios digitales
--  Script de base de datos · MySQL 8.x (compatible con 5.7)
--  Aprendiz: Sheril García · Ficha: 3221682
-- ---------------------------------------------------------------------
--  Uso en Clever Cloud
--   1) El add-on de MySQL ya entrega una base creada (variable MYSQL_ADDON_DB),
--      por eso este script NO incluye CREATE DATABASE. Conéctate a esa base con
--      MySQL Workbench, DBeaver o la consola y ejecútalo completo.
--   2) Es re-ejecutable: usa CREATE TABLE IF NOT EXISTS e INSERT IGNORE.
--   3) Antes de publicar, cambia el correo y el hash del administrador (sección 8).
-- =====================================================================

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------
-- 1. ROLES Y USUARIOS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
  id_rol       TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre       VARCHAR(30)  NOT NULL,
  descripcion  VARCHAR(150) NULL,
  PRIMARY KEY (id_rol),
  UNIQUE KEY uq_roles_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_rol             TINYINT UNSIGNED NOT NULL,
  nombre             VARCHAR(80)  NOT NULL,
  apellido           VARCHAR(80)  NOT NULL,
  email              VARCHAR(150) NOT NULL,
  password_hash      VARCHAR(255) NOT NULL,              -- bcrypt o Argon2, nunca texto plano
  telefono           VARCHAR(20)  NULL,
  foto_url           VARCHAR(255) NULL,
  estado             ENUM('activo','inactivo','bloqueado') NOT NULL DEFAULT 'activo',
  email_verificado   BOOLEAN      NOT NULL DEFAULT 0,
  intentos_fallidos  TINYINT UNSIGNED NOT NULL DEFAULT 0,
  bloqueado_hasta    DATETIME     NULL,                  -- bloqueo temporal por intentos fallidos
  token_recuperacion CHAR(64)     NULL,                  -- hash SHA-256 del token enviado por correo
  token_expira       DATETIME     NULL,
  acepto_datos_at    DATETIME     NULL,                  -- consentimiento (Ley 1581 de 2012)
  ultimo_acceso      DATETIME     NULL,
  created_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uq_usuarios_email (email),
  KEY idx_usuarios_rol_estado (id_rol, estado),
  CONSTRAINT fk_usuarios_rol FOREIGN KEY (id_rol) REFERENCES roles (id_rol)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS clientes (
  id_usuario        INT UNSIGNED NOT NULL,
  empresa           VARCHAR(120) NULL,
  tipo_documento    ENUM('CC','CE','NIT','PASAPORTE') NULL,
  numero_documento  VARCHAR(30)  NULL,
  ciudad            VARCHAR(80)  NULL,
  direccion         VARCHAR(150) NULL,
  PRIMARY KEY (id_usuario),
  CONSTRAINT fk_clientes_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vendedores (
  id_usuario           INT UNSIGNED NOT NULL,
  especialidad         VARCHAR(120) NULL,
  biografia            TEXT         NULL,
  portafolio_url       VARCHAR(255) NULL,
  porcentaje_comision  DECIMAL(5,2) NOT NULL DEFAULT 10.00,   -- % que retiene la plataforma
  PRIMARY KEY (id_usuario),
  CONSTRAINT chk_vendedores_comision CHECK (porcentaje_comision BETWEEN 0 AND 100),
  CONSTRAINT fk_vendedores_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. CATÁLOGO
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
  id_categoria  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre        VARCHAR(80)  NOT NULL,
  slug          VARCHAR(100) NOT NULL,
  descripcion   VARCHAR(255) NULL,
  activa        BOOLEAN      NOT NULL DEFAULT 1,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_categoria),
  UNIQUE KEY uq_categorias_nombre (nombre),
  UNIQUE KEY uq_categorias_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS servicios (
  id_servicio           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_vendedor           INT UNSIGNED NOT NULL,
  id_categoria          INT UNSIGNED NOT NULL,
  nombre                VARCHAR(150) NOT NULL,
  slug                  VARCHAR(180) NOT NULL,
  descripcion_corta     VARCHAR(255) NOT NULL,
  descripcion           TEXT         NOT NULL,
  precio                DECIMAL(12,2) NOT NULL,            -- COP
  dias_entrega          SMALLINT UNSIGNED NOT NULL,
  revisiones_incluidas  TINYINT UNSIGNED NOT NULL DEFAULT 1,
  imagen_url            VARCHAR(255) NULL,                 -- URL (p. ej. en Cellar)
  estado                ENUM('borrador','pendiente','publicado','rechazado','pausado')
                        NOT NULL DEFAULT 'borrador',
  motivo_rechazo        VARCHAR(255) NULL,
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_servicio),
  UNIQUE KEY uq_servicios_slug (slug),
  KEY idx_servicios_categoria_estado (id_categoria, estado),
  KEY idx_servicios_vendedor_estado (id_vendedor, estado),
  KEY idx_servicios_precio (precio),
  FULLTEXT KEY ft_servicios_busqueda (nombre, descripcion_corta, descripcion),
  CONSTRAINT chk_servicios_precio CHECK (precio >= 0),
  CONSTRAINT chk_servicios_dias CHECK (dias_entrega > 0),
  CONSTRAINT fk_servicios_vendedor FOREIGN KEY (id_vendedor) REFERENCES vendedores (id_usuario)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_servicios_categoria FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS favoritos (
  id_cliente   INT UNSIGNED NOT NULL,
  id_servicio  INT UNSIGNED NOT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_cliente, id_servicio),
  KEY idx_favoritos_servicio (id_servicio),
  CONSTRAINT fk_favoritos_cliente FOREIGN KEY (id_cliente) REFERENCES clientes (id_usuario)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_favoritos_servicio FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. COTIZACIONES Y CUPONES
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cotizaciones (
  id_cotizacion    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_cliente       INT UNSIGNED NOT NULL,
  id_vendedor      INT UNSIGNED NOT NULL,
  id_servicio      INT UNSIGNED NULL,                      -- servicio de referencia (opcional)
  titulo           VARCHAR(150) NOT NULL,
  requerimiento    TEXT         NOT NULL,                  -- lo que pide el cliente
  valor_propuesto  DECIMAL(12,2) NULL,                     -- respuesta del vendedor
  dias_entrega     SMALLINT UNSIGNED NULL,
  alcance          TEXT         NULL,
  vigente_hasta    DATE         NULL,
  estado           ENUM('solicitada','respondida','aceptada','rechazada','vencida','cancelada')
                   NOT NULL DEFAULT 'solicitada',
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_cotizacion),
  KEY idx_cotizaciones_cliente (id_cliente, estado),
  KEY idx_cotizaciones_vendedor (id_vendedor, estado),
  KEY idx_cotizaciones_servicio (id_servicio),
  CONSTRAINT chk_cotizaciones_valor CHECK (valor_propuesto IS NULL OR valor_propuesto >= 0),
  CONSTRAINT fk_cotizaciones_cliente FOREIGN KEY (id_cliente) REFERENCES clientes (id_usuario)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_cotizaciones_vendedor FOREIGN KEY (id_vendedor) REFERENCES vendedores (id_usuario)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_cotizaciones_servicio FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cupones (
  id_cupon       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo         VARCHAR(30)  NOT NULL,
  descripcion    VARCHAR(150) NULL,
  tipo           ENUM('porcentaje','monto_fijo') NOT NULL,
  valor          DECIMAL(12,2) NOT NULL,
  monto_minimo   DECIMAL(12,2) NOT NULL DEFAULT 0,
  fecha_inicio   DATETIME     NOT NULL,
  fecha_fin      DATETIME     NOT NULL,
  usos_maximos   INT UNSIGNED NULL,                        -- NULL = ilimitado
  usos_actuales  INT UNSIGNED NOT NULL DEFAULT 0,
  activo         BOOLEAN      NOT NULL DEFAULT 1,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_cupon),
  UNIQUE KEY uq_cupones_codigo (codigo),
  CONSTRAINT chk_cupones_valor CHECK (valor > 0),
  CONSTRAINT chk_cupones_fechas CHECK (fecha_fin > fecha_inicio),
  CONSTRAINT chk_cupones_porcentaje CHECK (tipo <> 'porcentaje' OR valor <= 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. PEDIDOS Y PAGOS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedidos (
  id_pedido      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo         VARCHAR(20)  NOT NULL,                    -- p. ej. PED-2026-000123
  id_cliente     INT UNSIGNED NOT NULL,
  id_cupon       INT UNSIGNED NULL,
  id_cotizacion  INT UNSIGNED NULL,                        -- si el pedido nació de una cotización
  estado         ENUM('pendiente_pago','pagado','en_proceso','completado','cancelado','reembolsado')
                 NOT NULL DEFAULT 'pendiente_pago',
  subtotal       DECIMAL(12,2) NOT NULL DEFAULT 0,
  descuento      DECIMAL(12,2) NOT NULL DEFAULT 0,
  impuesto       DECIMAL(12,2) NOT NULL DEFAULT 0,
  total          DECIMAL(12,2) NOT NULL DEFAULT 0,
  notas          VARCHAR(500)  NULL,
  created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_pedido),
  UNIQUE KEY uq_pedidos_codigo (codigo),
  UNIQUE KEY uq_pedidos_cotizacion (id_cotizacion),
  KEY idx_pedidos_cliente_fecha (id_cliente, created_at),
  KEY idx_pedidos_estado_fecha (estado, created_at),
  KEY idx_pedidos_cupon (id_cupon),
  CONSTRAINT chk_pedidos_montos CHECK (subtotal >= 0 AND descuento >= 0 AND impuesto >= 0 AND total >= 0),
  CONSTRAINT fk_pedidos_cliente FOREIGN KEY (id_cliente) REFERENCES clientes (id_usuario)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_pedidos_cupon FOREIGN KEY (id_cupon) REFERENCES cupones (id_cupon)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_pedidos_cotizacion FOREIGN KEY (id_cotizacion) REFERENCES cotizaciones (id_cotizacion)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS detalle_pedido (
  id_detalle              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_pedido               INT UNSIGNED NOT NULL,
  id_servicio             INT UNSIGNED NOT NULL,
  cantidad                SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  precio_unitario         DECIMAL(12,2) NOT NULL,          -- precio al momento de la compra
  comision_porcentaje     DECIMAL(5,2)  NOT NULL,          -- % del vendedor al momento de la compra
  subtotal                DECIMAL(12,2)
    GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
  comision_valor          DECIMAL(12,2)
    GENERATED ALWAYS AS (ROUND(cantidad * precio_unitario * comision_porcentaje / 100, 2)) STORED,
  estado                  ENUM('pendiente','en_proceso','entregado','en_revision','completado','cancelado')
                          NOT NULL DEFAULT 'pendiente',
  fecha_entrega_estimada  DATE NULL,
  created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_detalle),
  KEY idx_detalle_pedido (id_pedido),
  KEY idx_detalle_servicio_estado (id_servicio, estado),
  CONSTRAINT chk_detalle_cantidad CHECK (cantidad > 0),
  CONSTRAINT chk_detalle_precio CHECK (precio_unitario >= 0),
  CONSTRAINT fk_detalle_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_detalle_servicio FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pagos (
  id_pago             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_pedido           INT UNSIGNED NOT NULL,
  pasarela            VARCHAR(30)  NOT NULL,               -- p. ej. wompi, epayco, payu, mercadopago
  metodo              VARCHAR(30)  NULL,                   -- tarjeta, PSE, Nequi...
  referencia_externa  VARCHAR(100) NULL,                   -- id de la transacción en la pasarela
  monto               DECIMAL(12,2) NOT NULL,
  estado              ENUM('pendiente','aprobado','rechazado','reembolsado','anulado')
                      NOT NULL DEFAULT 'pendiente',
  respuesta_pasarela  JSON         NULL,                   -- payload del webhook (sin datos de tarjeta)
  fecha_pago          DATETIME     NULL,
  created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_pago),
  UNIQUE KEY uq_pagos_referencia (pasarela, referencia_externa),
  KEY idx_pagos_pedido (id_pedido),
  KEY idx_pagos_estado_fecha (estado, fecha_pago),
  CONSTRAINT chk_pagos_monto CHECK (monto >= 0),
  CONSTRAINT fk_pagos_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. ENTREGAS Y RESEÑAS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS entregas (
  id_entrega          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_detalle          INT UNSIGNED NOT NULL,
  descripcion         TEXT         NOT NULL,
  url_entrega         VARCHAR(500) NOT NULL,               -- enlace (Drive, Figma, GitHub...) o URL en Cellar
  estado              ENUM('entregada','aprobada','revision_solicitada') NOT NULL DEFAULT 'entregada',
  comentario_cliente  TEXT         NULL,
  fecha_entrega       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_respuesta     DATETIME     NULL,
  PRIMARY KEY (id_entrega),
  KEY idx_entregas_detalle (id_detalle, estado),
  CONSTRAINT fk_entregas_detalle FOREIGN KEY (id_detalle) REFERENCES detalle_pedido (id_detalle)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS resenas (
  id_resena     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_detalle    INT UNSIGNED NOT NULL,
  calificacion  TINYINT UNSIGNED NOT NULL,
  comentario    TEXT         NULL,
  estado        ENUM('visible','oculta') NOT NULL DEFAULT 'visible',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_resena),
  UNIQUE KEY uq_resenas_detalle (id_detalle),              -- una reseña por servicio comprado
  CONSTRAINT chk_resenas_calificacion CHECK (calificacion BETWEEN 1 AND 5),
  CONSTRAINT fk_resenas_detalle FOREIGN KEY (id_detalle) REFERENCES detalle_pedido (id_detalle)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. NOTIFICACIONES, PUSH Y AUDITORÍA
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notificaciones (
  id_notificacion  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario       INT UNSIGNED NOT NULL,
  tipo             VARCHAR(40)  NOT NULL,                  -- pedido_creado, pago_confirmado, nueva_entrega...
  titulo           VARCHAR(120) NOT NULL,
  mensaje          VARCHAR(500) NOT NULL,
  url_destino      VARCHAR(255) NULL,
  leida            BOOLEAN      NOT NULL DEFAULT 0,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_notificacion),
  KEY idx_notificaciones_usuario (id_usuario, leida, created_at),
  CONSTRAINT fk_notificaciones_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS suscripciones_push (
  id_suscripcion  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario      INT UNSIGNED NOT NULL,
  endpoint        VARCHAR(600) NOT NULL,                   -- Web Push (PWA)
  endpoint_hash   CHAR(64) GENERATED ALWAYS AS (SHA2(endpoint, 256)) STORED,
  p256dh_key      VARCHAR(255) NOT NULL,
  auth_key        VARCHAR(255) NOT NULL,
  user_agent      VARCHAR(255) NULL,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_suscripcion),
  UNIQUE KEY uq_push_endpoint (endpoint_hash),
  KEY idx_push_usuario (id_usuario),
  CONSTRAINT fk_push_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS auditoria (
  id_auditoria  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario    INT UNSIGNED NULL,                         -- NULL = acción del sistema
  accion        VARCHAR(60)  NOT NULL,                     -- LOGIN, CREAR_SERVICIO, CAMBIAR_ESTADO_PEDIDO...
  entidad       VARCHAR(40)  NULL,
  id_entidad    INT UNSIGNED NULL,
  detalle       JSON         NULL,
  ip            VARCHAR(45)  NULL,
  user_agent    VARCHAR(255) NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_auditoria),
  KEY idx_auditoria_usuario (id_usuario, created_at),
  KEY idx_auditoria_entidad (entidad, id_entidad),
  CONSTRAINT fk_auditoria_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. VISTAS
-- ---------------------------------------------------------------------
-- Catálogo público con calificación promedio (RF-14, RF-16)
CREATE OR REPLACE VIEW vw_catalogo_servicios AS
SELECT s.id_servicio, s.nombre, s.slug, s.descripcion_corta, s.precio, s.dias_entrega,
       s.revisiones_incluidas, s.imagen_url,
       c.id_categoria, c.nombre AS categoria,
       v.id_usuario AS id_vendedor, CONCAT(u.nombre, ' ', u.apellido) AS vendedor,
       COALESCE(r.promedio, 0) AS calificacion_promedio,
       COALESCE(r.total, 0)    AS total_resenas
FROM servicios s
JOIN categorias c ON c.id_categoria = s.id_categoria
JOIN vendedores v ON v.id_usuario   = s.id_vendedor
JOIN usuarios   u ON u.id_usuario   = v.id_usuario
LEFT JOIN (
    SELECT d.id_servicio, ROUND(AVG(rs.calificacion), 1) AS promedio, COUNT(*) AS total
    FROM resenas rs
    JOIN detalle_pedido d ON d.id_detalle = rs.id_detalle
    WHERE rs.estado = 'visible'
    GROUP BY d.id_servicio
) r ON r.id_servicio = s.id_servicio
WHERE s.estado = 'publicado' AND c.activa = 1 AND u.estado = 'activo';

-- Ventas, comisión e ingreso neto por vendedor y mes (RF-37, RF-38)
CREATE OR REPLACE VIEW vw_ventas_vendedor AS
SELECT s.id_vendedor,
       DATE_FORMAT(p.created_at, '%Y-%m')   AS periodo,
       SUM(d.cantidad)                      AS unidades_vendidas,
       SUM(d.subtotal)                      AS ventas_brutas,
       SUM(d.comision_valor)                AS comision_plataforma,
       SUM(d.subtotal - d.comision_valor)   AS ingreso_neto
FROM detalle_pedido d
JOIN pedidos   p ON p.id_pedido   = d.id_pedido
JOIN servicios s ON s.id_servicio = d.id_servicio
WHERE p.estado IN ('pagado','en_proceso','completado') AND d.estado <> 'cancelado'
GROUP BY s.id_vendedor, DATE_FORMAT(p.created_at, '%Y-%m');

-- ---------------------------------------------------------------------
-- 8. DATOS INICIALES
-- ---------------------------------------------------------------------
INSERT IGNORE INTO roles (id_rol, nombre, descripcion) VALUES
  (1, 'administrador', 'Gestiona usuarios, catálogo, pedidos, pagos y reportes'),
  (2, 'vendedor',      'Publica servicios, atiende pedidos y cotizaciones'),
  (3, 'cliente',       'Explora el catálogo, compra y califica servicios');

-- Administrador inicial. CAMBIA el correo y genera el hash con (npm i bcryptjs):
--   node -e "console.log(require('bcryptjs').hashSync('TuClaveSegura123', 10))"
INSERT IGNORE INTO usuarios (id_usuario, id_rol, nombre, apellido, email, password_hash, estado, email_verificado)
VALUES (1, 1, 'Administrador', 'Innova Digital', 'admin@example.com',
        '$2b$10$REEMPLAZAR_POR_EL_HASH_BCRYPT', 'activo', 1);

INSERT IGNORE INTO categorias (nombre, slug, descripcion) VALUES
  ('Diseño gráfico y branding', 'diseno-grafico-branding', 'Logos, identidad visual y piezas gráficas'),
  ('Desarrollo web y apps',     'desarrollo-web-apps',     'Sitios web, tiendas en línea, PWA y aplicaciones'),
  ('Marketing digital',         'marketing-digital',       'Campañas, redes sociales y publicidad en línea'),
  ('SEO y analítica',           'seo-analitica',           'Posicionamiento en buscadores y métricas'),
  ('Contenido y audiovisual',   'contenido-audiovisual',   'Redacción, fotografía, video y animación'),
  ('Soporte y hosting',         'soporte-hosting',         'Mantenimiento, dominios, hosting y soporte técnico');

-- ---------------------------------------------------------------------
-- 9. CONSULTAS DE EJEMPLO PARA EL BACKEND (sustituye ? por parámetros)
-- ---------------------------------------------------------------------
-- a) Búsqueda de texto en el catálogo (RF-15)
-- SELECT s.id_servicio, s.nombre, s.precio
-- FROM servicios s
-- WHERE s.estado = 'publicado'
--   AND MATCH(s.nombre, s.descripcion_corta, s.descripcion) AGAINST (? IN NATURAL LANGUAGE MODE);
--
-- b) Revisiones usadas vs. incluidas de un servicio comprado (RF-30)
-- SELECT d.id_detalle, sv.revisiones_incluidas,
--        COALESCE(SUM(e.estado = 'revision_solicitada'), 0) AS revisiones_usadas
-- FROM detalle_pedido d
-- JOIN servicios sv ON sv.id_servicio = d.id_servicio
-- LEFT JOIN entregas e ON e.id_detalle = d.id_detalle
-- WHERE d.id_detalle = ?
-- GROUP BY d.id_detalle, sv.revisiones_incluidas;
--
-- c) Trabajos pendientes de un vendedor (RF-26)
-- SELECT p.codigo, p.created_at, d.id_detalle, sv.nombre, d.estado
-- FROM detalle_pedido d
-- JOIN pedidos   p  ON p.id_pedido   = d.id_pedido
-- JOIN servicios sv ON sv.id_servicio = d.id_servicio
-- WHERE sv.id_vendedor = ? AND p.estado IN ('pagado','en_proceso')
-- ORDER BY p.created_at DESC;

-- ---------------------------------------------------------------------
-- 10. (OPCIONAL) REINICIAR LA BASE · borra TODO. Úsalo solo en desarrollo.
-- ---------------------------------------------------------------------
-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP VIEW  IF EXISTS vw_ventas_vendedor, vw_catalogo_servicios;
-- DROP TABLE IF EXISTS auditoria, suscripciones_push, notificaciones, resenas, entregas,
--                      pagos, detalle_pedido, pedidos, cupones, cotizaciones, favoritos,
--                      servicios, categorias, vendedores, clientes, usuarios, roles;
-- SET FOREIGN_KEY_CHECKS = 1;
