@echo off
setlocal enabledelayedexpansion

:: CONFIGURAÇÕES
set SERVER_USER=dikma
set SERVER_HOST=srv-dk11
set SERVER_DIR=/var/www/nowaste-front-end
set SSH_KEY=C:\Users\%USERNAME%\.ssh\id_rsa
set IMAGE_NAME=nowaste-front-end
set CONTAINER_NAME=nowaste-front-end
set PORT=9003

echo.
echo ========================================
echo  Enviando código para o servidor...
echo ========================================
echo.

:: Compacta o projeto (exclui node_modules e dist)
tar --exclude=node_modules --exclude=.git -czf project.tar.gz .

:: Envia para o servidor
scp -i "%SSH_KEY%" project.tar.gz %SERVER_USER%@%SERVER_HOST%:/tmp/

:: Conecta no servidor e faz o deploy
ssh -i "%SSH_KEY%" %SERVER_USER%@%SERVER_HOST% ^
"rm -rf %SERVER_DIR% && \
 mkdir -p %SERVER_DIR% && \
 tar -xzf /tmp/project.tar.gz -C %SERVER_DIR% && \
 rm /tmp/project.tar.gz && \
 cd %SERVER_DIR% && \
 docker stop %CONTAINER_NAME% || true && \
 docker rm %CONTAINER_NAME% || true && \
 docker build -t %IMAGE_NAME% . && \
 docker run -d -p %PORT%:%PORT% --name %CONTAINER_NAME% %IMAGE_NAME%"

:: Limpa o arquivo local
del project.tar.gz

echo.
echo ========================================
echo  Deploy finalizado!
echo  Acesse: http://%SERVER_HOST%:%PORT%
echo ========================================
pause
