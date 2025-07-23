@echo off
echo ========================================================
echo Deploy Nowaste Frontend - Enviando arquivos para o servidor
echo ========================================================

REM Configurações
set SERVER_USER=dikma
set SERVER_HOST=10.3.22.206
set SERVER_DIR=/var/www/nowaste-front-end
set IMAGE_NAME=nowaste-front-end
set CONTAINER_NAME=nowaste-front-end
set PORT=9003

REM Compilar a aplicação para produção
echo.
echo 🛠️  Build do projeto Next.js...
call npm run build
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro ao rodar o build.
    exit /b
)

REM Copiar arquivos para o servidor via SCP
echo.
echo 🚀 Enviando arquivos para o servidor...
bash -c "scp -r . %SERVER_USER%@%SERVER_HOST%:%SERVER_DIR%"

REM Acessar o servidor e reiniciar o container
echo.
echo 🔁 Reiniciando container no servidor...
bash -c "ssh %SERVER_USER%@%SERVER_HOST% \"cd %SERVER_DIR% && docker stop %CONTAINER_NAME% && docker rm %CONTAINER_NAME% && docker build -t %IMAGE_NAME% . && docker run -d -p %PORT%:%PORT% --name %CONTAINER_NAME% %IMAGE_NAME%\""

echo.
echo ✅ Deploy finalizado! Acesse: http://%SERVER_HOST%:%PORT%
pause
