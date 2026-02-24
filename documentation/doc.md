# Project Documentation: TaskFlow (Local-First To-Do List)

## 1. Visión General
**TaskFlow** es una aplicación de gestión de tareas minimalista y de alto rendimiento. El objetivo principal es ofrecer una experiencia de usuario fluida (Zero Latency) mediante un enfoque **Local-First**, eliminando la necesidad de un backend o base de datos externa.

## 2. Especificaciones de Diseño (UI/UX)
El diseño se basa en el **Minimalismo Funcional** para evitar la sobrecarga cognitiva.

### A. Sistema de Colores
| Token | Valor Hex | Uso |
| :--- | :--- | :--- |
| **Primary** | `#6366F1` | Botones de acción, estados activos y focus. |
| **Surface** | `#FFFFFF` | Fondo de las tarjetas de tareas. |
| **Background** | `#F9FAFB` | Color de fondo de la aplicación. |
| **Text-Main** | `#111827` | Títulos y cuerpo de texto principal. |
| **Text-Muted** | `#6B7280` | Fechas, placeholders y metadatos. |
| **Success** | `#10B981` | Checkboxes completados y badges de éxito. |
| **Danger** | `#EF4444` | Botones de eliminar y alertas. |

### B. Tipografía
- **Fuente:** `Inter`, `system-ui`, sans-serif.
- **Sizes:** - Títulos: 24px (Bold)
  - Cuerpo: 16px (Regular)
  - Detalles: 14px (Medium)

### C. Componentes y Layout
- **Cards:** Bordes redondeados de `8px` (`rounded-lg` en Tailwind) y una sombra sutil `shadow-sm`.
- **Inputs:** Bordes de 2px que cambian al color `Primary` en estado de focus.
- **Animaciones:** Transiciones de 200ms para hover y cambios de estado (checkbox).

## 3. Arquitectura y Estructura de Carpetas
```text
src/
├── assets/             # Iconos y recursos estáticos
├── components/         # Componentes de UI
│   ├── ui/             # Botones, Inputs, Badges (Atómicos)
│   ├── layout/         # Navbar, Container, Layout Principal
│   └── todo/           # TaskItem, TaskList, TaskForm (Negocio)
├── hooks/              # Custom Hooks (useLocalStorage, useTasks)
├── utils/              # Validaciones e IDs únicos
├── App.jsx             # Punto de entrada de la UI
└── main.jsx            # Renderizado de React