# Tarjeta de Circulación GT

Sistema de gestión y consulta para tarjetas de circulación de vehículos en Guatemala. Este proyecto ha sido desarrollado como una aplicación web moderna orientada al control y administración de bases de datos de tránsito. Permite gestionar propietarios, vehículos, tarjetas de circulación y catálogos, además de incluir un editor para ejecutar consultas SQL personalizadas directamente sobre la base de datos de Supabase.

## Tecnologías utilizadas

El proyecto está construido utilizando un conjunto de herramientas modernas para el desarrollo web de alto rendimiento y la gestión de datos:

React: Biblioteca de JavaScript para construir la interfaz de usuario interactiva.

TanStack Start: Framework de desarrollo que proporciona Server-Side Rendering (SSR) y optimización para aplicaciones de React.

TanStack Router: Enrutador con tipado estático seguro para gestionar la navegación de la aplicación.

Tailwind CSS: Framework de diseño para aplicar estilos responsivos y modernos de forma ágil.

TypeScript: Lenguaje de programación que añade tipado estático a JavaScript para mejorar la robustez del código.

Vite: Herramienta de compilación rápida para el entorno de desarrollo y empaquetado del proyecto.

Supabase: Plataforma de desarrollo que provee una base de datos PostgreSQL en la nube, autenticación e interfaz en tiempo real.

## Características del proyecto

El sistema cuenta con las siguientes secciones y funcionalidades principales:

Gestión de propietarios: Registro y consulta de datos personales de propietarios mediante su NIT y CUI.

Control de vehículos: Registro detallado de vehículos incluyendo número de placa, chasis, motor, año, marca, línea y color.

Tarjetas de circulación: Emisión, visualización, impresión y desactivación de tarjetas de circulación asociadas a un vehículo y un propietario.

Catálogos del sistema: Visualización y administración de marcas, líneas, colores, tipos de vehículo y usos de vehículo.

Consola SQL interactiva: Interfaz para realizar consultas estructuradas de manera directa a la base de datos, útil para análisis académicos y reportes personalizados.

## Estructura de la base de datos

El diseño de la base de datos relacional implementado en Supabase (PostgreSQL) consta de las siguientes tablas:

marca: Catálogo de marcas de vehículos.

linea: Catálogo de líneas de vehículos asociadas a una marca específica.

color: Catálogo de colores de vehículos.

tipo_vehiculo: Catálogo de tipos de vehículos (por ejemplo, sedán, camioneta, motocicleta).

uso_vehiculo: Catálogo de usos permitidos para los vehículos (por ejemplo, particular, comercial).

propietario: Registro de propietarios identificados por su NIT (llave primaria) y CUI.

vehiculo: Registro de vehículos identificados por su placa (llave primaria) con referencias a catálogos de marcas/líneas, colores y tipos de vehículos.

tarjeta_circulacion: Registro histórico y vigente de tarjetas de circulación, vinculando un vehículo con su respectivo propietario, fechas de emisión, vencimiento y estado de vigencia.

historial_cambios_tarjeta: Registro de los cambios realizados a las tarjetas de circulación.

### Nombre de la base de datos

El nombre predeterminado de la base de datos en la instancia de Supabase es postgres. Todo el esquema de datos y sus tablas correspondientes se encuentran alojados bajo el esquema estándar public de PostgreSQL.

## Requisitos previos

Para poder ejecutar este proyecto localmente, es necesario contar con las siguientes herramientas instaladas en su sistema:

Node.js (versión 18 o superior recomendada)

Un gestor de paquetes de Node como pnpm, bun o npm

## Instrucciones de instalación

Siga estos pasos para preparar el entorno de desarrollo e instalar todas las dependencias necesarias:

1. Clone o abra el directorio del proyecto en su terminal de comandos.

2. Instale los paquetes requeridos utilizando su gestor de paquetes preferido. Se recomienda utilizar pnpm o bun debido a los archivos de bloqueo provistos.

Para pnpm:
```bash
pnpm install
```

Para bun:
```bash
bun install
```

Para npm:
```bash
npm install
```

3. Configure las variables de entorno:

```env
SUPABASE_URL="su_url_de_supabase"
SUPABASE_PUBLISHABLE_KEY="su_llave_publica_de_supabase"
VITE_SUPABASE_PROJECT_ID="su_id_de_proyecto_de_supabase"
VITE_SUPABASE_PUBLISHABLE_KEY="su_llave_publica_de_supabase"
VITE_SUPABASE_URL="su_url_de_supabase"
```

### Credenciales necesarias

Para establecer la conexión con la base de datos y la API de Supabase, es necesario configurar las siguientes claves en el archivo .env de la raíz del proyecto:

SUPABASE_URL: URL del proyecto de Supabase.

SUPABASE_PUBLISHABLE_KEY: Llave pública (anon key) del proyecto de Supabase.

VITE_SUPABASE_PROJECT_ID: Identificador único del proyecto de Supabase.

VITE_SUPABASE_PUBLISHABLE_KEY: Llave pública (anon key) accesible desde el cliente de Vite.

VITE_SUPABASE_URL: URL del proyecto de Supabase accesible desde el cliente de Vite.

## Cómo ejecutar el proyecto

Una vez instaladas las dependencias y configurado el entorno con las credenciales necesarias, puede iniciar la aplicación web en su máquina local:

1. Para iniciar el servidor de desarrollo local, ejecute el siguiente comando en la terminal:

Para pnpm:
```bash
pnpm dev
```

Para bun:
```bash
bun dev
```

Para npm:
```bash
npm run dev
```

2. Abra su navegador web y navegue a la dirección local que se indica en la terminal.

3. Si desea compilar el proyecto para producción y optimizar los archivos, puede ejecutar el comando de construcción:

Para pnpm:
```bash
pnpm build
```

Para bun:
```bash
bun build
```

Para npm:
```bash
npm run build
```

### Puerto utilizado

El servidor de desarrollo de TanStack Start se inicia de manera predeterminada en el puerto 3000. Por lo tanto, la aplicación estará accesible localmente a través de la dirección URL http://localhost:3000.
