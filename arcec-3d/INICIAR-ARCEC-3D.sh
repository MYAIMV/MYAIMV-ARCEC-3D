#!/bin/bash

# Ubicarse siempre en la carpeta donde está este script,
# sin importar desde dónde se ejecute.
cd "$(dirname "$0")"

echo ""
echo "============================================"
echo "   ARCEC-3D - CENIDET"
echo "   Iniciando la aplicación..."
echo "============================================"
echo ""

# --- Verificar que Node.js esté instalado ---
if ! command -v node >/dev/null 2>&1; then
    echo "[ERROR] No se encontró Node.js en este equipo."
    echo ""
    echo "Descárgalo e instálalo desde: https://nodejs.org"
    echo "Después vuelve a ejecutar este archivo."
    echo ""
    read -p "Presiona Enter para salir..."
    exit 1
fi

# --- Verificar que exista el archivo de configuración ---
if [ ! -f "backend/.env" ]; then
    echo "[AVISO] No se encontró el archivo de configuración backend/.env"
    echo ""
    if [ -f "backend/.env.example" ]; then
        cp "backend/.env.example" "backend/.env"
        echo "Se creó backend/.env a partir del ejemplo."
        echo ""
        echo "IMPORTANTE: abre ese archivo y escribe la contraseña de tu MySQL"
        echo "en la línea DB_PASSWORD antes de continuar."
        echo ""
        read -p "Presiona Enter cuando lo hayas configurado..."
    else
        echo "No se encontró backend/.env.example. Revisa la instalación."
        read -p "Presiona Enter para salir..."
        exit 1
    fi
fi

# --- Instalar dependencias del backend si hace falta ---
if [ ! -d "backend/node_modules" ]; then
    echo "[1/3] Instalando dependencias del servidor... (puede tardar unos minutos)"
    cd backend
    if ! npm install; then
        echo "[ERROR] Falló la instalación de dependencias del servidor."
        cd ..
        read -p "Presiona Enter para salir..."
        exit 1
    fi
    cd ..
else
    echo "[1/3] Dependencias del servidor: ya instaladas."
fi

# --- Instalar dependencias del frontend si hace falta ---
if [ ! -d "frontend/node_modules" ]; then
    echo "[2/3] Instalando dependencias de la interfaz... (puede tardar unos minutos)"
    cd frontend
    if ! npm install; then
        echo "[ERROR] Falló la instalación de dependencias de la interfaz."
        cd ..
        read -p "Presiona Enter para salir..."
        exit 1
    fi
    cd ..
else
    echo "[2/3] Dependencias de la interfaz: ya instaladas."
fi

# --- Compilar la interfaz si aún no existe la versión compilada ---
if [ ! -f "backend/public/index.html" ]; then
    echo "[3/3] Preparando la interfaz..."
    cd frontend
    if ! npm run build; then
        echo "[ERROR] Falló la compilación de la interfaz."
        cd ..
        read -p "Presiona Enter para salir..."
        exit 1
    fi
    cd ..
else
    echo "[3/3] Interfaz: ya preparada."
fi

echo ""
echo "============================================"
echo "   Listo. Abriendo ARCEC-3D en el navegador"
echo "   Dirección: http://localhost:3001"
echo ""
echo "   NO CIERRES ESTA VENTANA mientras uses la"
echo "   aplicación. Para salir, presiona Ctrl+C."
echo "============================================"
echo ""

# --- Abrir el navegador en segundo plano tras unos segundos ---
(
  sleep 4
  if command -v open >/dev/null 2>&1; then
      open "http://localhost:3001"        # macOS
  elif command -v xdg-open >/dev/null 2>&1; then
      xdg-open "http://localhost:3001"    # Linux
  fi
) &

cd backend
npm start
