ns
# Sistema de Tarjetas de Circulación — Guatemala

App cliente-servidor en español para consultar, emitir y mantener tarjetas de circulación vehicular guatemaltecas.

## Backend (Lovable Cloud / PostgreSQL)

Activar Lovable Cloud y crear el esquema vía migración. Tablas tal cual el modelo provisto:
`marca`, `linea`, `color`, `tipo_vehiculo`, `uso_vehiculo`, `propietario`, `vehiculo`, `tarjeta_circulacion`.

Adicional:
- RLS habilitado en todas las tablas. Para esta fase académica: políticas permisivas a usuarios `authenticated` (lectura/escritura). Sin login obligatorio se puede usar acceso anónimo si el usuario lo prefiere — confirmar en la implementación.
- Datos semilla: marcas/líneas comunes (Toyota Corolla, Honda Civic, etc.), colores, tipos (Automóvil, Motocicleta, Pick-up, Camión, Bus), usos (Particular, Comercial, Transporte público).
- Vista `v_tarjeta_completa` que une tarjeta + vehículo + propietario + catálogos para consulta rápida.

## Frontend (TanStack Start, español)

Rutas:
- `/` — Dashboard: KPIs (tarjetas activas, vencidas, próximas a vencer, vehículos registrados) + búsqueda rápida por placa/NIT.
- `/consulta` — Buscar tarjeta por número, placa o NIT del propietario. Muestra ficha ordenada con todos los datos (vehículo, propietario, vigencia, estado).
- `/tarjetas` — Listado con filtros (estado, vencimiento, tipo). Acciones: ver, editar, desactivar.
- `/tarjetas/nueva` — Formulario para emitir nueva tarjeta. Permite seleccionar vehículo y propietario existentes o crearlos en línea.
- `/tarjetas/$id` — Detalle de tarjeta con acciones de mantenimiento:
  - Cambio de dueño (selecciona/crea propietario, emite nueva tarjeta y desactiva la anterior — historial preservado).
  - Cambio de motor (actualiza `vehiculo.motor`, registra observación).
  - Trámite de cambio de color (actualiza `vehiculo.id_color`).
  - Desactivar por impago o vencimiento (set `estado=false`).
- `/vehiculos` — CRUD de vehículos (placa, chasis, motor, año, asientos, marca→línea, color, tipo).
- `/propietarios` — CRUD de propietarios (NIT, CUI, nombres, apellidos, dirección).
- `/catalogos` — Mantenimiento de marcas, líneas, colores, tipos y usos.

## Detalles técnicos

- Server functions con `createServerFn` para todas las consultas/mutaciones, usando el cliente Supabase autenticado.
- Validación con Zod (NIT 13–15 dígitos, CUI 13, placa formato GT, año razonable, fechas coherentes).
- TanStack Query para cache + invalidación tras mutaciones.
- Componentes shadcn: `Table`, `Dialog`, `Form`, `Select`, `Badge` (estado: Activa / Vencida / Desactivada / Por vencer).
- Dropdown encadenado Marca → Línea.
- Tarjeta de circulación visualizada como "ficha" tipo documento oficial (encabezado, secciones Vehículo / Propietario / Vigencia, sello de estado).
- Diseño limpio, institucional, paleta sobria (azul marino + blanco + acentos), tipografía legible (Inter para datos, serif sutil para encabezados de ficha). Tokens semánticos en `src/styles.css`.

## Entregables verificables

- Base de datos creada y poblada con catálogos.
- Emisión de tarjeta nueva end-to-end.
- Cambio de dueño/motor/color funcional.
- Desactivación por impago/vencimiento.
- Consulta unificada que muestra toda la información ordenada.

## Preguntas antes de implementar

1. ¿Requiere autenticación de usuarios o acceso abierto para esta fase académica?
2. ¿Quieres datos de ejemplo (vehículos/propietarios/tarjetas ficticios) precargados para demo?
