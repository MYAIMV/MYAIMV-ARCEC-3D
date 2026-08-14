@echo off
chcp 65001 >nul
title ARCEC-3D
cd /d "%~dp0"

echo.
echo ============================================
echo    ARCEC-3D - CENIDET
echo    Iniciando la aplicacion...
echo ============================================
echo.

REM --- Verificar que Node.js este instalado ---
where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] No se encontro Node.js en este equipo.
    echo.
    echo Descargalo e instalalo desde: https://nodejs.org
    echo Despues vuelve a ejecutar este archivo.
    echo.
    pause
    exit /b 1
)

REM --- Verificar que exista el archivo de configuracion ---
if not exist "backend\.env" (
    echo [AVISO] No se encontro el archivo de configuracion backend\.env
    echo.
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        echo Se creo backend\.env a partir del ejemplo.
        echo.
        echo IMPORTANTE: abre ese archivo y escribe la contrasena de tu MySQL
        echo en la linea DB_PASSWORD antes de continuar.
        echo.
        pause
    ) else (
        echo No se encontro backend\.env.example. Revisa la instalacion.
        pause
        exit /b 1
    )
)

REM --- Instalar dependencias del backend si hace falta ---
if not exist "backend\node_modules" (
    echo [1/3] Instalando dependencias del servidor... (puede tardar unos minutos^)
    cd backend
    call npm install
    if errorlevel 1 (
        echo [ERROR] Fallo la instalacion de dependencias del servidor.
        cd ..
        pause
        exit /b 1
    )
    cd ..
) else (
    echo [1/3] Dependencias del servidor: ya instaladas.
)

REM --- Instalar dependencias del frontend si hace falta ---
if not exist "frontend\node_modules" (
    echo [2/3] Instalando dependencias de la interfaz... (puede tardar unos minutos^)
    cd frontend
    call npm install
    if errorlevel 1 (
        echo [ERROR] Fallo la instalacion de dependencias de la interfaz.
        cd ..
        pause
        exit /b 1
    )
    cd ..
) else (
    echo [2/3] Dependencias de la interfaz: ya instaladas.
)

REM --- Compilar la interfaz si aun no existe la version compilada ---
if not exist "backend\public\index.html" (
    echo [3/3] Preparando la interfaz...
    cd frontend
    call npm run build
    if errorlevel 1 (
        echo [ERROR] Fallo la compilacion de la interfaz.
        cd ..
        pause
        exit /b 1
    )
    cd ..
) else (
    echo [3/3] Interfaz: ya preparada.
)

echo.
echo ============================================
echo    Listo. Abriendo ARCEC-3D en el navegador
echo    Direccion: http://localhost:3001
echo.
echo    NO CIERRES ESTA VENTANA mientras uses la
echo    aplicacion. Para salir, presiona Ctrl+C.
echo ============================================
echo.

REM --- Abrir el navegador despues de unos segundos, ya que el servidor tarda en arrancar ---
start "" cmd /c "timeout /t 4 >nul && start http://localhost:3001"

cd backend
call npm start

pause
