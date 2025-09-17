# Plan de Implementación: Ondas de Violencia por Tipo

## Descripción
Implementar un sistema donde el componente de olas (WaveAnimation) muestre colores diferentes según el tipo de violencia de la historia actual.

## Objetivos
1. Asociar tipos de violencia con paletas de colores específicas
2. Modificar el componente WaveAnimation para aceptar colores basados en el tipo de violencia
3. Actualizar el componente History para pasar el tipo de violencia al componente de olas
4. Mantener la funcionalidad existente en Interactive.jsx

## Tipos de Violencia Reales y Colores Asociados

### Delincuencia Común (ID: 3)
- Colores: ['#8B0000', '#B22222', '#DC143C', '#FF6347', '#FF4500']

### Desaparición Forzada (ID: 46)
- Colores: ['#2F4F4F', '#556B2F', '#6B8E23', '#808000', '#9ACD32']

### Desplazamiento (ID: 7)
- Colores: ['#4B0082', '#800080', '#9932CC', '#8A2BE2', '#DA70D6']

### Ejército (ID: 45)
- Colores: ['#2F4F4F', '#708090', '#696969', '#A9A9A9', '#C0C0C0']

### Guerrilla (ID: 2)
- Colores: ['#000080', '#0000CD', '#4169E1', '#1E90FF', '#87CEEB']

### Maltrato Familiar (ID: 6)
- Colores: ['#8B4513', '#A52A2A', '#CD853F', '#D2691E', '#DEB887']

### Maltrato Infantil (ID: 18)
- Colores: ['#8B4513', '#A0522D', '#D2691E', '#CD853F', '#DEB887']

### Paramilitarismo (ID: 26)
- Colores: ['#4B0082', '#483D8B', '#6A5ACD', '#7B68EE', '#9370DB']

### Prostitución Forzada (ID: 5)
- Colores: ['#8B0000', '#A52A2A', '#B22222', '#CD5C5C', '#F08080']

### Terrorismo (ID: 20)
- Colores: ['#2F4F4F', '#556B2F', '#6B8E23', '#808000', '#9ACD32']

### Victimaria (ID: 32)
- Colores: ['#4B0082', '#800080', '#9932CC', '#8A2BE2', '#DA70D6']

### Violencia Sexual (ID: 4)
- Colores: ['#8B0000', '#B22222', '#DC143C', '#FF6347', '#FF4500']

### Violencia Social (ID: 19)
- Colores: ['#2F4F4F', '#708090', '#696969', '#A9A9A9', '#C0C0C0']

## Implementación

### 1. Modificar WaveAnimation.jsx
- Añadir prop `violenceTypes` al componente (array de IDs de tipos de violencia)
- Crear un mapeo de IDs de tipos de violencia a paletas de colores
- Modificar la lógica para usar los colores según los tipos de violencia de la historia
- Mantener la funcionalidad existente cuando se pasan colores explícitamente

### 2. Actualizar History.jsx
- Obtener los tipos de violencia del ítem actual (`item.violencia`)
- Pasar los tipos de violencia al componente WaveAnimation

### 3. Mantener funcionalidad en Interactive.jsx
- Verificar que el uso existente del componente con colores personalizados no se vea afectado
- Confirmar que cuando se pasan colores explícitamente, se usen esos colores en lugar de los basados en violencia

### 4. Pruebas
- Verificar que cada tipo de violencia muestra los colores correctos en History.jsx
- Asegurar que la funcionalidad existente no se rompa en Interactive.jsx
- Probar historias con múltiples tipos de violencia

## Consideraciones Adicionales
- Definir un color por defecto para historias sin tipos de violencia especificados
- Considerar la accesibilidad y contraste de colores
- Mantener la coherencia visual con el resto de la aplicación
- Manejar correctamente historias con múltiples tipos de violencia (usar una paleta combinada o seleccionar la más representativa)
- Priorizar los colores explícitamente pasados sobre los derivados de tipos de violencia