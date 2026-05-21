-- 1. Catálogo: Marcas
INSERT INTO public.marca (nombre) VALUES
  ('Toyota'),
  ('Honda'),
  ('Nissan'),
  ('Ford'),
  ('Chevrolet');

-- 2. Catálogo: Líneas (Depende de marca)
-- Usamos los IDs autogenerados (1=Toyota, 2=Honda, 3=Nissan, 4=Ford, 5=Chevrolet)
INSERT INTO public.linea (nombre, id_marca) VALUES
  ('Corolla', 1),
  ('Hilux', 1),
  ('Civic', 2),
  ('CR-V', 2),
  ('Sentra', 3),
  ('Ranger', 4),
  ('Spark', 5);

-- 3. Catálogo: Colores
INSERT INTO public.color (nombre) VALUES
  ('Blanco'),
  ('Negro'),
  ('Rojo'),
  ('Gris'),
  ('Azul'),
  ('Plata');

-- 4. Catálogo: Tipos de Vehículo
INSERT INTO public.tipo_vehiculo (nombre) VALUES
  ('Automóvil'),
  ('Pick-up'),
  ('Camioneta'),
  ('Motocicleta'),
  ('Camión');

-- 5. Catálogo: Usos de Vehículo
INSERT INTO public.uso_vehiculo (nombre) VALUES
  ('Particular'),
  ('Comercial'),
  ('Alquiler'),
  ('Transporte Público');

-- 6. Propietarios (Uso de DPI para CUI y NIT)
INSERT INTO public.propietario (nit, cui, nombres, apellidos, direccion) VALUES
  ('1234567-8', '2987654320101', 'Juan Carlos', 'Pérez García', 'Zona 1, Ciudad de Guatemala'),
  ('8765432-1', '3123456780101', 'María Fernanda', 'López Soto', 'Zona 10, Ciudad de Guatemala'),
  ('5432167-9', '2567891230101', 'Carlos Alberto', 'Gómez Ruiz', 'Zona 4, Mixco');

-- 7. Vehículos (Depende de linea, color y tipo_vehiculo)
-- Formato de placa comercial de GT: P123ABC
INSERT INTO public.vehiculo (placa, chasis, motor, anio, asientos, id_linea, id_color, id_tipo) VALUES
  ('P123ABC', 'JTDB1234567890123', '2TRFE123456', 2020, 5, 1, 1, 1), -- Toyota Corolla, Blanco, Automóvil
  ('P456DEF', 'MROB9876543210987', 'K24A1987654', 2018, 5, 4, 4, 3), -- Honda CR-V, Gris, Camioneta
  ('P789GHI', '3N1AB123456789012', 'QR25DE12345', 2022, 5, 5, 2, 1); -- Nissan Sentra, Negro, Automóvil

-- 8. Tarjetas de Circulación (Depende de vehiculo, propietario y uso_vehiculo)
INSERT INTO public.tarjeta_circulacion (placa, nit_propietario, id_uso, fecha_emision, fecha_vencimiento, estado) VALUES
  ('P123ABC', '1234567-8', 1, '2023-01-15', '2024-01-14', TRUE), -- Juan Carlos, Particular
  ('P456DEF', '8765432-1', 1, '2023-05-20', '2024-05-19', TRUE), -- María Fernanda, Particular
  ('P789GHI', '5432167-9', 2, '2023-11-10', '2024-11-09', TRUE); -- Carlos Alberto, Comercial
 INSERT INTO HISTORIAL_CAMBIOS_TARJETA
(no_tarjeta, tipo_cambio, descripcion, valor_anterior, valor_nuevo)
VALUES
(1, 'Cambio de propietario',
 'Transferencia de propiedad de la tarjeta de circulación',
 'NIT: 1234567-8',
 'NIT: 9876543-1');

INSERT INTO HISTORIAL_CAMBIOS_TARJETA
(no_tarjeta, tipo_cambio, descripcion, valor_anterior, valor_nuevo)
VALUES
(2, 'Cambio de dirección',
 'Actualización de dirección del propietario',
 'Zona 1, Ciudad de Guatemala',
 'Zona 10, Ciudad de Guatemala');

INSERT INTO HISTORIAL_CAMBIOS_TARJETA
(no_tarjeta, tipo_cambio, descripcion, valor_anterior, valor_nuevo)
VALUES
(3, 'Renovación',
 'Renovación de vigencia de la tarjeta de circulación',
 '2025-12-31',
 '2026-12-31');

INSERT INTO HISTORIAL_CAMBIOS_TARJETA
(no_tarjeta, tipo_cambio, descripcion, valor_anterior, valor_nuevo)
VALUES
(4, 'Cambio de uso',
 'Cambio de uso del vehículo registrado',
 'Particular',
 'Comercial');

INSERT INTO HISTORIAL_CAMBIOS_TARJETA
(no_tarjeta, tipo_cambio, descripcion, valor_anterior, valor_nuevo)
VALUES
(5, 'Corrección de placa',
 'Corrección de error tipográfico en placa',
 'P123ABC',
 'P123ABD');