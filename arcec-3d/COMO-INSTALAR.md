# ARCEC-3D — Instrucciones de instalación

Aplicación para visualizar resultados de algoritmos de programación genética.
CENIDET · Departamento de Ciencias Computacionales

---

## Requisitos previos

Antes de ejecutar la aplicación, tu equipo debe tener instalado:

1. **Node.js** (versión 18 o superior) — descárgalo de https://nodejs.org
2. **MySQL** (versión 5.7 o superior) — debe estar corriendo en tu equipo

Para verificar que los tienes, abre una terminal y escribe:

```
node -v
mysql --version
```

Si ambos comandos responden con un número de versión, ya estás listo.

---

## Instalación (solo se hace una vez)

### Paso 1 — Crear la base de datos

Abre tu gestor de MySQL (Workbench, phpMyAdmin o la terminal) y ejecuta el archivo:

```
backend/database/schema.sql
```

Desde la terminal sería:

```
mysql -u root -p < backend/database/schema.sql
```

Esto crea la base de datos `arcec3d` con sus tablas.

### Paso 2 — Configurar la contraseña de MySQL

Dentro de la carpeta `backend`, busca el archivo `.env.example` y haz una copia
llamada `.env` (sin nada antes del punto). Ábrela con el Bloc de notas y escribe
la contraseña de tu MySQL:

```
DB_PASSWORD=tu_contraseña_aquí
```

También conviene cambiar `JWT_SECRET` por cualquier texto largo y aleatorio.

> Si no haces este paso, el script lo detectará y creará el archivo por ti,
> pero de todas formas tendrás que escribir la contraseña.

---

## Cómo abrir la aplicación

### En Windows

Haz **doble clic** en el archivo:

```
INICIAR-ARCEC-3D.bat
```

### En Mac o Linux

Abre una terminal en la carpeta del proyecto y ejecuta:

```
chmod +x INICIAR-ARCEC-3D.sh     (solo la primera vez)
./INICIAR-ARCEC-3D.sh
```

---

## Qué hace el script

La primera vez tardará varios minutos, porque:

1. Verifica que Node.js esté instalado
2. Instala las dependencias del servidor y de la interfaz
3. Prepara (compila) la interfaz
4. Arranca el servidor y abre el navegador automáticamente en `http://localhost:3001`

**Las siguientes veces será mucho más rápido**, porque ya no repite la instalación.

> **Importante:** no cierres la ventana negra (terminal) mientras uses la aplicación;
> ahí es donde está corriendo el servidor. Para cerrar todo, presiona `Ctrl + C`
> en esa ventana o simplemente ciérrala.

---

## Problemas comunes

| Problema | Solución |
|---|---|
| "No se encontró Node.js" | Instálalo desde https://nodejs.org y vuelve a ejecutar el script |
| "Error al conectar a MySQL" | Verifica que MySQL esté corriendo y que la contraseña en `backend/.env` sea la correcta |
| El navegador no abre solo | Ábrelo manualmente y entra a `http://localhost:3001` |
| La página aparece en blanco | Espera unos segundos más y recarga; el servidor puede tardar en arrancar |
| "El puerto 3001 ya está en uso" | Cierra otras ventanas de la aplicación, o cambia `PORT` en `backend/.env` |

---

## Actualizar la aplicación tras un cambio en el código

Si modificaste algo de la interfaz, borra la carpeta `backend/public` y vuelve
a ejecutar el script: detectará que falta y la compilará de nuevo.
