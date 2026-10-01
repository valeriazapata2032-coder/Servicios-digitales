-- =====================================================================
-- Innova Digital - Plataforma PWA de servicios digitales
-- Motor: MySQL 8 (Clever Cloud)
-- En Clever Cloud la base ya viene creada: NO ejecutes CREATE DATABASE.
-- Conéctate con las credenciales del panel y ejecuta este archivo.
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- ---------------------------------------------------------------------
-- 1. ROLES Y USUARIOS
-- ---------------------------------------------------------------------
CREATE TABLE roles (
  id_rol      TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(30)  NOT NULL,
  descripcion VARCHAR(150) NULL,
  PRIMARY KEY (id_rol),
  UNIQUE KEY uq_roles_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE usuarios (
  id_usuario      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_rol          TINYINT UNSIGNED NOT NULL,
  nombre          VARCHAR(100) NOT NULL,
  correo          VARCHAR(150) NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  telefono        VARCHAR(20)  NULL,
  canal_contacto  ENUM('whatsapp','correo','instagram') NOT NULL DEFAULT 'whatsapp',
  foto_url        VARCHAR(255) NULL,
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  acepta_datos    BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uq_usuarios_correo (correo),
  KEY idx_usuarios_rol (id_rol),
  CONSTRAINT fk_usuarios_rol FOREIGN KEY (id_rol) REFERENCES roles (id_rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE perfiles_vendedor (
  id_usuario            INT UNSIGNED NOT NULL,
  biografia             TEXT NULL,
  calificacion_promedio DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (id_usuario),
  CONSTRAINT fk_perfilvend_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. CATÁLOGO Y PORTAFOLIO
-- ---------------------------------------------------------------------
CREATE TABLE categorias (
  id_categoria INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre       VARCHAR(80)  NOT NULL,
  descripcion  VARCHAR(255) NULL,
  activa       BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id_categoria),
  UNIQUE KEY uq_categorias_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE servicios (
  id_servicio    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_vendedor    INT UNSIGNED NOT NULL,
  id_categoria   INT UNSIGNED NOT NULL,
  titulo         VARCHAR(150) NOT NULL,
  descripcion    TEXT NOT NULL,
  precio_base    DECIMAL(12,2) NOT NULL CHECK (precio_base >= 0),
  dias_entrega   SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  estado         ENUM('pendiente','aprobado','rechazado','pausado') NOT NULL DEFAULT 'pendiente',
  creado_en      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_servicio),
  KEY idx_servicios_vendedor (id_vendedor),
  KEY idx_servicios_categoria (id_categoria),
  KEY idx_servicios_estado (estado),
  FULLTEXT KEY ft_servicios_busqueda (titulo, descripcion),
  CONSTRAINT fk_servicios_vendedor  FOREIGN KEY (id_vendedor)  REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_servicios_categoria FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE paquetes_servicio (
  id_paquete   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_servicio  INT UNSIGNED NOT NULL,
  nombre       VARCHAR(60) NOT NULL,
  descripcion  TEXT NULL,
  precio       DECIMAL(12,2) NOT NULL CHECK (precio >= 0),
  dias_entrega SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (id_paquete),
  KEY idx_paquetes_servicio (id_servicio),
  CONSTRAINT fk_paquetes_servicio FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE imagenes_servicio (
  id_imagen   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_servicio INT UNSIGNED NOT NULL,
  url         VARCHAR(255) NOT NULL,
  orden       TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id_imagen),
  KEY idx_imagenes_servicio (id_servicio),
  CONSTRAINT fk_imagenes_servicio FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE portafolio (
  id_portafolio INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_vendedor   INT UNSIGNED NOT NULL,
  id_categoria  INT UNSIGNED NOT NULL,
  titulo        VARCHAR(150) NOT NULL,
  descripcion   TEXT NULL,
  media_url     VARCHAR(255) NOT NULL,
  visible       BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_portafolio),
  KEY idx_portafolio_vendedor (id_vendedor),
  KEY idx_portafolio_categoria (id_categoria),
  CONSTRAINT fk_portafolio_vendedor  FOREIGN KEY (id_vendedor)  REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_portafolio_categoria FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. CARRITO Y FAVORITOS
-- ---------------------------------------------------------------------
CREATE TABLE carritos (
  id_carrito INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_cliente INT UNSIGNED NOT NULL,
  creado_en  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_carrito),
  UNIQUE KEY uq_carritos_cliente (id_cliente),
  CONSTRAINT fk_carritos_cliente FOREIGN KEY (id_cliente) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE items_carrito (
  id_item     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_carrito  INT UNSIGNED NOT NULL,
  id_servicio INT UNSIGNED NOT NULL,
  id_paquete  INT UNSIGNED NULL,
  cantidad    SMALLINT UNSIGNED NOT NULL DEFAULT 1 CHECK (cantidad > 0),
  PRIMARY KEY (id_item),
  KEY idx_items_carrito (id_carrito),
  CONSTRAINT fk_items_carrito  FOREIGN KEY (id_carrito)  REFERENCES carritos (id_carrito) ON DELETE CASCADE,
  CONSTRAINT fk_items_servicio FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio) ON DELETE CASCADE,
  CONSTRAINT fk_items_paquete  FOREIGN KEY (id_paquete)  REFERENCES paquetes_servicio (id_paquete) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE favoritos (
  id_cliente  INT UNSIGNED NOT NULL,
  id_servicio INT UNSIGNED NOT NULL,
  creado_en   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_cliente, id_servicio),
  CONSTRAINT fk_fav_cliente  FOREIGN KEY (id_cliente)  REFERENCES usuarios (id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_fav_servicio FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. CUPONES, PEDIDOS, DIAGNÓSTICO Y PAGOS
-- ---------------------------------------------------------------------
CREATE TABLE cupones (
  id_cupon      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo        VARCHAR(30) NOT NULL,
  tipo          ENUM('porcentaje','monto_fijo') NOT NULL,
  valor         DECIMAL(10,2) NOT NULL CHECK (valor > 0),
  vigente_hasta DATE NULL,
  usos_maximos  INT UNSIGNED NULL,
  usos_actuales INT UNSIGNED NOT NULL DEFAULT 0,
  activo        BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id_cupon),
  UNIQUE KEY uq_cupones_codigo (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pedidos (
  id_pedido    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_cliente   INT UNSIGNED NOT NULL,
  id_vendedor  INT UNSIGNED NOT NULL,
  id_cupon     INT UNSIGNED NULL,
  subtotal     DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  descuento    DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total        DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  estado       ENUM('pendiente_pago','pagado','en_proceso','entregado','cancelado','reembolsado') NOT NULL DEFAULT 'pendiente_pago',
  notas        TEXT NULL,
  creado_en    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  entregado_en DATETIME NULL,
  PRIMARY KEY (id_pedido),
  KEY idx_pedidos_cliente (id_cliente),
  KEY idx_pedidos_vendedor (id_vendedor),
  KEY idx_pedidos_estado (estado),
  CONSTRAINT fk_pedidos_cliente  FOREIGN KEY (id_cliente)  REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_pedidos_vendedor FOREIGN KEY (id_vendedor) REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_pedidos_cupon    FOREIGN KEY (id_cupon)    REFERENCES cupones (id_cupon) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE detalle_pedido (
  id_detalle      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_pedido       INT UNSIGNED NOT NULL,
  id_servicio     INT UNSIGNED NOT NULL,
  id_paquete      INT UNSIGNED NULL,
  cantidad        SMALLINT UNSIGNED NOT NULL DEFAULT 1 CHECK (cantidad > 0),
  precio_unitario DECIMAL(12,2) NOT NULL CHECK (precio_unitario >= 0),
  PRIMARY KEY (id_detalle),
  KEY idx_detalle_pedido (id_pedido),
  CONSTRAINT fk_detalle_pedido   FOREIGN KEY (id_pedido)   REFERENCES pedidos (id_pedido) ON DELETE CASCADE,
  CONSTRAINT fk_detalle_servicio FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio),
  CONSTRAINT fk_detalle_paquete  FOREIGN KEY (id_paquete)  REFERENCES paquetes_servicio (id_paquete) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Diagnóstico inicial de las necesidades del cliente
CREATE TABLE briefings (
  id_briefing          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_pedido            INT UNSIGNED NOT NULL,
  nombre_negocio       VARCHAR(150) NOT NULL,
  descripcion_negocio  TEXT NULL,
  objetivos            TEXT NOT NULL,
  publico_objetivo     TEXT NULL,
  redes_actuales       TEXT NULL,
  referencias          TEXT NULL,
  presupuesto_estimado DECIMAL(12,2) NULL,
  creado_en            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_briefing),
  UNIQUE KEY uq_briefings_pedido (id_pedido),
  CONSTRAINT fk_briefings_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pagos (
  id_pedido  INT UNSIGNED NOT NULL,
  id_pago    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  metodo     ENUM('tarjeta','pse','nequi','daviplata','transferencia','efectivo') NOT NULL,
  monto      DECIMAL(12,2) NOT NULL CHECK (monto >= 0),
  estado     ENUM('pendiente','aprobado','rechazado','reembolsado') NOT NULL DEFAULT 'pendiente',
  referencia VARCHAR(100) NULL,
  pagado_en  DATETIME NULL,
  creado_en  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_pago),
  KEY idx_pagos_pedido (id_pedido),
  CONSTRAINT fk_pagos_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. ENTREGA, COMUNICACIÓN Y VALORACIÓN
-- ---------------------------------------------------------------------
CREATE TABLE entregables (
  id_entregable   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_pedido       INT UNSIGNED NOT NULL,
  archivo_url     VARCHAR(255) NOT NULL,
  descripcion     VARCHAR(255) NULL,
  estado_revision ENUM('pendiente','aprobado','ajustes_solicitados') NOT NULL DEFAULT 'pendiente',
  comentario_cliente TEXT NULL,
  subido_en       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_entregable),
  KEY idx_entregables_pedido (id_pedido),
  CONSTRAINT fk_entregables_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE mensajes (
  id_mensaje INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_pedido  INT UNSIGNED NOT NULL,
  id_emisor  INT UNSIGNED NOT NULL,
  contenido  TEXT NOT NULL,
  enviado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_mensaje),
  KEY idx_mensajes_pedido (id_pedido, enviado_en),
  CONSTRAINT fk_mensajes_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido) ON DELETE CASCADE,
  CONSTRAINT fk_mensajes_emisor FOREIGN KEY (id_emisor) REFERENCES usuarios (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE resenas (
  id_resena    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_pedido    INT UNSIGNED NOT NULL,
  id_servicio  INT UNSIGNED NOT NULL,
  id_cliente   INT UNSIGNED NOT NULL,
  calificacion TINYINT UNSIGNED NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  comentario   TEXT NULL,
  visible      BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_resena),
  UNIQUE KEY uq_resenas_pedido (id_pedido),
  KEY idx_resenas_servicio (id_servicio),
  CONSTRAINT fk_resenas_pedido   FOREIGN KEY (id_pedido)   REFERENCES pedidos (id_pedido),
  CONSTRAINT fk_resenas_servicio FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio),
  CONSTRAINT fk_resenas_cliente  FOREIGN KEY (id_cliente)  REFERENCES usuarios (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cotizaciones (
  id_cotizacion INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_cliente    INT UNSIGNED NOT NULL,
  id_vendedor   INT UNSIGNED NOT NULL,
  descripcion   TEXT NOT NULL,
  monto         DECIMAL(12,2) NULL,
  estado        ENUM('solicitada','enviada','aceptada','rechazada') NOT NULL DEFAULT 'solicitada',
  creado_en     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_cotizacion),
  KEY idx_cot_cliente (id_cliente),
  KEY idx_cot_vendedor (id_vendedor),
  CONSTRAINT fk_cot_cliente  FOREIGN KEY (id_cliente)  REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_cot_vendedor FOREIGN KEY (id_vendedor) REFERENCES usuarios (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. SOPORTE, NOTIFICACIONES Y AUDITORÍA
-- ---------------------------------------------------------------------
CREATE TABLE tickets_soporte (
  id_ticket   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario  INT UNSIGNED NOT NULL,
  id_pedido   INT UNSIGNED NULL,
  asunto      VARCHAR(150) NOT NULL,
  descripcion TEXT NOT NULL,
  estado      ENUM('abierto','en_revision','resuelto','cerrado') NOT NULL DEFAULT 'abierto',
  respuesta   TEXT NULL,
  creado_en   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_ticket),
  KEY idx_tickets_usuario (id_usuario),
  CONSTRAINT fk_tickets_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
  CONSTRAINT fk_tickets_pedido  FOREIGN KEY (id_pedido)  REFERENCES pedidos (id_pedido) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notificaciones (
  id_notificacion INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario      INT UNSIGNED NOT NULL,
  titulo          VARCHAR(120) NOT NULL,
  mensaje         TEXT NOT NULL,
  leida           BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_notificacion),
  KEY idx_notif_usuario (id_usuario, leida),
  CONSTRAINT fk_notif_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE auditoria (
  id_auditoria INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_usuario   INT UNSIGNED NULL,
  accion       VARCHAR(60) NOT NULL,
  entidad      VARCHAR(60) NOT NULL,
  id_registro  INT UNSIGNED NULL,
  detalle      JSON NULL,
  fecha        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_auditoria),
  KEY idx_auditoria_usuario (id_usuario),
  KEY idx_auditoria_fecha (fecha),
  CONSTRAINT fk_auditoria_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. ENCUESTAS (Encuesta de Servicios Digitales)
-- ---------------------------------------------------------------------
CREATE TABLE encuestas (
  id_encuesta INT UNSIGNED NOT NULL AUTO_INCREMENT,
  titulo      VARCHAR(150) NOT NULL,
  descripcion VARCHAR(255) NULL,
  estado      ENUM('borrador','publicada','cerrada') NOT NULL DEFAULT 'borrador',
  creado_en   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_encuesta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE preguntas_encuesta (
  id_pregunta INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_encuesta INT UNSIGNED NOT NULL,
  enunciado   VARCHAR(255) NOT NULL,
  tipo        ENUM('opcion_unica','opcion_multiple','texto') NOT NULL DEFAULT 'opcion_unica',
  orden       TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id_pregunta),
  KEY idx_preguntas_encuesta (id_encuesta),
  CONSTRAINT fk_preguntas_encuesta FOREIGN KEY (id_encuesta) REFERENCES encuestas (id_encuesta) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE opciones_pregunta (
  id_opcion   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_pregunta INT UNSIGNED NOT NULL,
  texto       VARCHAR(150) NOT NULL,
  orden       TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id_opcion),
  KEY idx_opciones_pregunta (id_pregunta),
  CONSTRAINT fk_opciones_pregunta FOREIGN KEY (id_pregunta) REFERENCES preguntas_encuesta (id_pregunta) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE participaciones_encuesta (
  id_participacion INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_encuesta      INT UNSIGNED NOT NULL,
  id_usuario       INT UNSIGNED NULL,
  correo           VARCHAR(150) NULL,
  consentimiento   BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_participacion),
  UNIQUE KEY uq_participacion_correo (id_encuesta, correo),
  KEY idx_participaciones_encuesta (id_encuesta),
  CONSTRAINT fk_particip_encuesta FOREIGN KEY (id_encuesta) REFERENCES encuestas (id_encuesta) ON DELETE CASCADE,
  CONSTRAINT fk_particip_usuario  FOREIGN KEY (id_usuario)  REFERENCES usuarios (id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE respuestas_encuesta (
  id_respuesta     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_participacion INT UNSIGNED NOT NULL,
  id_pregunta      INT UNSIGNED NOT NULL,
  id_opcion        INT UNSIGNED NULL,
  texto            TEXT NULL,
  PRIMARY KEY (id_respuesta),
  KEY idx_resp_participacion (id_participacion),
  KEY idx_resp_pregunta (id_pregunta),
  KEY idx_resp_opcion (id_opcion),
  CONSTRAINT fk_resp_participacion FOREIGN KEY (id_participacion) REFERENCES participaciones_encuesta (id_participacion) ON DELETE CASCADE,
  CONSTRAINT fk_resp_pregunta      FOREIGN KEY (id_pregunta)      REFERENCES preguntas_encuesta (id_pregunta) ON DELETE CASCADE,
  CONSTRAINT fk_resp_opcion        FOREIGN KEY (id_opcion)        REFERENCES opciones_pregunta (id_opcion) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- 8. DATOS INICIALES
-- ---------------------------------------------------------------------
INSERT INTO roles (id_rol, nombre, descripcion) VALUES
  (1, 'administrador', 'Gestiona usuarios, catálogo, pedidos, encuestas y reportes'),
  (2, 'vendedor',      'Publica servicios, atiende pedidos y entrega trabajos'),
  (3, 'cliente',       'Explora el catálogo, solicita servicios y valora entregas');

INSERT INTO categorias (nombre, descripcion) VALUES
  ('Manejo de redes sociales', 'Gestión de comunidad, publicaciones y calendario de contenido'),
  ('Diseño gráfico',           'Logos, piezas para redes, material publicitario'),
  ('Edición de videos',        'Edición de video para redes sociales y promoción'),
  ('Creación de contenido',    'Fotografía, video, textos y contenido digital atractivo'),
  ('Páginas web',              'Sitios web, tiendas en línea y aplicaciones web'),
  ('Publicidad en línea',      'Campañas publicitarias en redes y buscadores'),
  ('Asesoría digital',         'Diagnóstico, estrategia de marketing digital y acompañamiento');

-- Encuesta de Servicios Digitales
INSERT INTO encuestas (id_encuesta, titulo, descripcion, estado) VALUES
  (1, 'Encuesta de Servicios Digitales',
      'Ayúdanos a conocer tus necesidades y preferencias sobre servicios digitales', 'publicada');

INSERT INTO preguntas_encuesta (id_pregunta, id_encuesta, enunciado, tipo, orden) VALUES
  (1, 1, '¿Qué servicio digital te interesa más?', 'opcion_unica', 1),
  (2, 1, '¿Qué factor es más importante al contratar un servicio digital?', 'opcion_unica', 2),
  (3, 1, '¿Por qué medio preferirías contactarnos?', 'opcion_unica', 3),
  (4, 1, '¿Con qué frecuencia usas servicios digitales?', 'opcion_unica', 4);

INSERT INTO opciones_pregunta (id_pregunta, texto, orden) VALUES
  (1, 'Manejo de redes sociales', 1),
  (1, 'Diseño gráfico', 2),
  (1, 'Edición de videos', 3),
  (1, 'Creación de contenido', 4),
  (1, 'Páginas web', 5),
  (2, 'Calidad', 1),
  (2, 'Precio', 2),
  (2, 'Tiempo de entrega', 3),
  (2, 'Atención personalizada', 4),
  (3, 'WhatsApp', 1),
  (3, 'Página web', 2),
  (3, 'Instagram', 3),
  (3, 'Facebook', 4),
  (4, 'Diariamente', 1),
  (4, 'Varias veces por semana', 2),
  (4, 'Ocasionalmente', 3),
  (4, 'Casi nunca', 4);

-- Usuario administrador inicial: genera el hash con bcrypt desde tu backend
-- (nunca guardes contraseñas en texto plano) y descomenta:
-- INSERT INTO usuarios (id_rol, nombre, correo, password_hash, acepta_datos)
-- VALUES (1, 'Administrador', 'admin@tudominio.com', '<hash_bcrypt>', TRUE);

-- ---------------------------------------------------------------------
-- 9. VISTAS ÚTILES
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW v_servicios_calificacion AS
SELECT s.id_servicio,
       s.titulo,
       ROUND(AVG(r.calificacion), 2) AS promedio,
       COUNT(r.id_resena)            AS total_resenas
FROM servicios s
LEFT JOIN resenas r ON r.id_servicio = s.id_servicio AND r.visible = TRUE
GROUP BY s.id_servicio, s.titulo;

-- Resultados de encuesta en porcentajes (como el análisis de mercado del proyecto)
CREATE OR REPLACE VIEW v_resultados_encuesta AS
SELECT q.id_encuesta,
       q.id_pregunta,
       q.enunciado,
       o.id_opcion,
       o.texto AS opcion,
       COUNT(r.id_respuesta) AS votos,
       ROUND(100 * COUNT(r.id_respuesta) /
             NULLIF((SELECT COUNT(DISTINCT r2.id_participacion)
                     FROM respuestas_encuesta r2
                     WHERE r2.id_pregunta = q.id_pregunta), 0), 1) AS porcentaje
FROM preguntas_encuesta q
JOIN opciones_pregunta o ON o.id_pregunta = q.id_pregunta
LEFT JOIN respuestas_encuesta r ON r.id_opcion = o.id_opcion
GROUP BY q.id_encuesta, q.id_pregunta, q.enunciado, o.id_opcion, o.texto;
