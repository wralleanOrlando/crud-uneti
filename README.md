# Sistema de Inventario Universitario

Aplicación CRUD para la gestión de inventario de una universidad. Permite registrar, consultar, actualizar y eliminar categorías, productos y registros de stock.

## Tecnologías

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Angular | v22 | Framework frontend |
| Tailwind CSS | v4 | Framework de estilos CSS |
| Supabase | - | Backend como servicio (PostgreSQL) |
| TypeScript | v6 | Lenguaje de programación |
| ngx-logger | v5 | Sistema de logs para desarrollo |

## Requisitos previos

- Node.js v18 o superior
- npm v9 o superior
- Angular CLI v22 o superior
- Cuenta en [Supabase](https://supabase.com)

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd crud-angular
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar las credenciales de Supabase en `src/environments/environment.ts`:
```typescript
export const environment = {
  supabaseUrl: 'https://tu-proyecto.supabase.co',
  supabaseKey: 'tu-api-key'
};
```

## Iniciar el programa

Para iniciar el servidor de desarrollo:

```bash
ng serve
```

Abrir el navegador en http://localhost:4200

La aplicación se recarga automáticamente al modificar los archivos.

## Persistencia de datos con Supabase

La aplicación utiliza **Supabase** como backend para la persistencia de datos. Supabase es una plataforma que proporciona:

- **API REST automática**: Generada directamente desde el esquema de PostgreSQL
- **Base de datos PostgreSQL**: Almacenamiento relacional de datos
- **SDK de JavaScript**: Cliente oficial `@supabase/supabase-js` para interactuar con la API

### ¿Cómo funciona?

1. Angular se conecta a Supabase a través del SDK (`@supabase/supabase-js`)
2. Los servicios realizan operaciones CRUD usando el cliente de Supabase
3. Supabase traduce estas operaciones a consultas SQL en PostgreSQL
4. Los datos se almacenan en las tablas de la base de datos

### Ejemplo de operación

```typescript
// Obtener todas las categorías
const { data } = await supabase.from('categorias').select('*');

// Insertar una nueva categoría
const { data } = await supabase.from('categorias').insert({ nombre: 'Nueva' });

// Actualizar una categoría
await supabase.from('categorias').update({ nombre: 'Editada' }).eq('id', 1);

// Eliminar una categoría
await supabase.from('categorias').delete().eq('id', 1);
```

## Diagrama de Clases

```
┌─────────────────────────────────────────────────────────────────────┐
│                           MODELOS                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐       ┌─────────────────┐                     │
│  │    Categoria     │       │     Producto     │                     │
│  ├─────────────────┤       ├─────────────────┤                     │
│  │ id?: number     │       │ id?: number     │                     │
│  │ nombre: string  │       │ categoria_id: FK│                     │
│  │ descripcion?: str│       │ nombre: string  │                     │
│  │ created_at?: str│       │ descripcion?: str│                    │
│  └─────────────────┘       │ precio: number  │                     │
│                            │ codigo?: string │                     │
│                            │ created_at?: str│                     │
│                            │ categorias?: Cat│                     │
│                            └─────────────────┘                     │
│                                                                     │
│  ┌─────────────────┐       ┌─────────────────┐                     │
│  │      Stock       │       │     Estado      │                     │
│  ├─────────────────┤       ├─────────────────┤                     │
│  │ id?: number     │       │ id?: number     │                     │
│  │ producto_id: FK │       │ nombre: string  │                     │
│  │ cantidad: number│       │ descripcion?: str│                    │
│  │ ubicacion?: str │       └─────────────────┘                     │
│  │ estado_id: FK   │                                               │
│  │ fecha_ingreso?  │                                               │
│  │ observaciones?  │                                               │
│  │ updated_at?: str│                                               │
│  │ productos?: Prod│                                               │
│  │ estados?: Estado│                                               │
│  └─────────────────┘                                               │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                          SERVICIOS                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ SupabaseService                                               │  │
│  │ - Cliente principal para conectar con Supabase                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ CategoriaService                                              │  │
│  │ + getAll()          Obtener todas las categorías               │  │
│  │ + getById(id)       Buscar una categoría por ID               │  │
│  │ + create(cat)       Crear una nueva categoría                 │  │
│  │ + update(id, cat)   Actualizar una categoría                  │  │
│  │ + delete(id)        Eliminar una categoría                    │  │
│  │ + count()           Contar total de categorías                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ ProductoService                                               │  │
│  │ + getAll()          Obtener todos los productos (con categoría)│  │
│  │ + getById(id)       Buscar un producto por ID                 │  │
│  │ + create(prod)      Crear un nuevo producto                   │  │
│  │ + update(id, prod)  Actualizar un producto                    │  │
│  │ + delete(id)        Eliminar un producto                      │  │
│  │ + count()           Contar total de productos                 │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ StockService                                                  │  │
│  │ + getAll()          Obtener todo el stock (con producto/estado)│  │
│  │ + getById(id)       Buscar un registro de stock por ID        │  │
│  │ + create(stock)     Crear un nuevo registro de stock          │  │
│  │ + update(id, stock) Actualizar un registro de stock           │  │
│  │ + delete(id)        Eliminar un registro de stock             │  │
│  │ + totalCantidad()   Sumar total de unidades en stock          │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Diagrama Entidad-Relación

```
┌─────────────────┐         ┌─────────────────┐
│    Categoria     │         │     Estado      │
├─────────────────┤         ├─────────────────┤
│ PK id           │         │ PK id           │
│    nombre       │         │    nombre       │
│    descripcion  │         │    descripcion  │
│    created_at   │         └─────────────────┘
└─────────────────┘                 │
        │                           │
        │ 1                         │ 1
        │                           │
        │ *                         │ *
┌─────────────────┐         ┌─────────────────┐
│     Producto     │         │      Stock      │
├─────────────────┤         ├─────────────────┤
│ PK id           │         │ PK id           │
│ FK categoria_id │◄────────│ FK producto_id  │
│    nombre       │         │ FK estado_id    │◄────
│    descripcion  │         │    cantidad     │
│    precio       │         │    ubicacion    │
│    codigo       │         │    fecha_ingreso│
│    created_at   │         │    observaciones│
└─────────────────┘         │    updated_at   │
                            └─────────────────┘

Relaciones:
  Categoria 1 ──── * Producto   (una categoría tiene muchos productos)
  Producto  1 ──── * Stock      (un producto puede tener mucho stock)
  Estado    1 ──── * Stock      (un estado puede estar en muchos registros)
```

## Estructura del proyecto

```
src/
├── app/
│   ├── models/                          # Interfaces de datos
│   │   ├── categoria.model.ts
│   │   ├── producto.model.ts
│   │   ├── stock.model.ts
│   │   └── estado.model.ts
│   │
│   ├── services/                        # Servicios para comunicarse con Supabase
│   │   ├── supabase.service.ts          # Cliente principal de Supabase
│   │   ├── categoria.service.ts         # CRUD de categorías
│   │   ├── producto.service.ts          # CRUD de productos
│   │   ├── stock.service.ts             # CRUD de stock
│   │   ├── estado.service.ts            # Consulta de estados
│   │   └── toast.service.ts             # Sistema de notificaciones
│   │
│   ├── components/
│   │   ├── layout/                      # Componentes reutilizables
│   │   │   ├── modal/                   # Modal para formularios
│   │   │   ├── confirm-modal/           # Modal de confirmación
│   │   │   ├── loading/                 # Indicador de carga
│   │   │   ├── empty-state/             # Mensaje cuando no hay datos
│   │   │   └── toast/                   # Notificaciones emergentes
│   │   │
│   │   ├── dashboard/                   # Panel principal con contadores
│   │   │
│   │   ├── categorias/                  # Módulo de categorías
│   │   │   ├── categorias-list/         # Listado de categorías
│   │   │   └── categoria-form/          # Formulario de categoría
│   │   │
│   │   ├── productos/                   # Módulo de productos
│   │   │   ├── productos-list/          # Listado de productos
│   │   │   └── producto-form/           # Formulario de producto
│   │   │
│   │   └── stock/                       # Módulo de stock
│   │       ├── stock-list/              # Listado de stock
│   │       └── stock-form/              # Formulario de stock
│   │
│   ├── environments/
│   │   └── environment.ts               # Credenciales de Supabase
│   │
│   ├── app.ts                           # Componente raíz
│   ├── app.routes.ts                    # Configuración de rutas
│   └── app.config.ts                    # Configuración de la aplicación
│
├── styles.css                           # Estilos globales con Tailwind
└── main.ts                              # Punto de entrada
```

## Rutas

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | DashboardComponent | Panel principal con contadores |
| `/categorias` | CategoriasListComponent | Listado y gestión de categorías |
| `/productos` | ProductosListComponent | Listado y gestión de productos |
| `/stock` | StockListComponent | Listado y gestión de stock |

## Funcionalidades

### Categorías
- Ver listado de categorías
- Crear nueva categoría
- Editar categoría existente
- Eliminar categoría (con confirmación)

### Productos
- Ver listado de productos con su categoría
- Crear nuevo producto (asignando categoría)
- Editar producto existente
- Eliminar producto (con confirmación)

### Stock
- Ver listado de registros de stock
- Crear nuevo registro (asignando producto y estado)
- Editar registro existente
- Eliminar registro (con confirmación)

### Dashboard
- Conteo total de categorías
- Conteo total de productos
- Suma total de unidades en stock

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `ng serve` | Iniciar servidor de desarrollo |
| `ng build` | Compilar proyecto |
| `ng build --configuration production` | Compilar para producción |
| `ng generate component <nombre>` | Crear nuevo componente |
| `ng generate service <nombre>` | Crear nuevo servicio |

## Build de producción

```bash
ng build --configuration production
```

Los archivos compilados se generan en el directorio `dist/`.
