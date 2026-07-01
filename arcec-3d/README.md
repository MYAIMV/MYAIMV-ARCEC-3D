# ARCEC-3D

Aplicación web para la consulta y visualización de resultados de algoritmos de programación genética, desarrollada para el Departamento de Ciencias Computacionales del CENIDET.

## Estructura del proyecto

```
arcec-3d/
├── backend/          → API REST (Node.js + Express + MySQL)
└── frontend/         → Interfaz web (React + Vite + Tailwind + Three.js)
```

---

## 1. Base de datos (MySQL)

1. Abre tu gestor de MySQL (Workbench, phpMyAdmin, línea de comandos, etc.)
2. Ejecuta el script `backend/database/schema.sql` completo. Esto crea la base de datos `arcec3d` y sus dos tablas: `usuarios` y `funciones_destacadas`.

```bash
mysql -u root -p < backend/database/schema.sql
```

---

## 2. Backend

```bash
cd backend
npm install
```

Copia `.env.example` a `.env` y edita tus credenciales de MySQL:

```bash
cp .env.example .env
```

Edita `.env`:
```
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=arcec3d

JWT_SECRET=escribe_aqui_un_texto_largo_y_aleatorio
JWT_EXPIRES_IN=8h
```

Corre el servidor:
```bash
npm run dev
```

Deberías ver:
```
✅ Conectado a MySQL correctamente
🚀 Servidor ARCEC-3D corriendo en http://localhost:3001
```

---

## 3. Frontend

En otra terminal:

```bash
cd frontend
npm install
```

(Opcional) copia `.env.example` a `.env` si tu backend corre en otro puerto/host:
```bash
cp .env.example .env
```

Corre el servidor de desarrollo:
```bash
npm run dev
```

Abre en el navegador: **http://localhost:5173**

---

## 4. Uso

1. Ve a `http://localhost:5173`, click en **Iniciar sesion** → **Regístrate aquí** para crear tu primera cuenta de investigador.
2. Inicia sesión con esa cuenta.
3. En **Graficar**, arrastra un archivo `.csv` o `.txt` con resultados del algoritmo evolutivo (formato Eddie o Dummy, se detecta automáticamente).
4. Si es formato Eddie (varios árboles `T1`..`T9`), selecciona cuál árbol y qué dos variables graficar.
5. Manipula la superficie 3D con el mouse (rotar, hacer zoom).
6. Usa **Descargar grafica** para exportar una imagen, o **Destacar grafica** para guardarla en tu historial.
7. Consulta tus experimentos guardados en **Historial** o **Función destacada**.

---

## Formatos de archivo soportados

**Formato Eddie** — CSV con columnas `train_error, test_error, ..., T1...T9, weights_W, bias_b`. Cada `Ti` es una expresión algebraica independiente (ej. `sub(x756, x433)`).

**Formato Dummy** — Texto separado por `;`: `generacion;expresion;(np.float32(min), np.float32(avg), np.float32(max), np.float64(nevals))`.

**Tokens matemáticos soportados:**
- Eddie: `add, sub, mul, sin, cos, tanh, square, cube, p_log, p_sqrt, p_exp`
- Dummy: `Tan, Acos, Divide, Norm, Csc, Csch, Minimum, Sqr`

Las expresiones fuera de este alfabeto no serán interpretadas por el motor de renderizado.

---

## Stack tecnológico

- **Backend:** Node.js, Express, MySQL (mysql2), JWT, bcryptjs, multer
- **Frontend:** React 18, Vite, React Router, Tailwind CSS, Three.js, Axios

## Notas de arquitectura

- El backend **no almacena** los archivos CSV crudos — solo procesa en memoria y regresa el resultado. Lo único que se persiste en MySQL son credenciales de usuario y metadatos de funciones destacadas (expresión algebraica + nombre + imagen preview en base64), conforme a la restricción de espacio en disco del servidor escolar.
- El motor de evaluación matemática (`math.evaluator.js`) interpreta las expresiones con un parser propio (tokenizer + recursive descent), no usa `eval()` de JavaScript por seguridad.
- Las variables sin dominio geométrico explícito (como en el formato Eddie) se barren por convención en el rango `[-1.5, 1.5]`, igual que describe la metodología original en MATLAB.
