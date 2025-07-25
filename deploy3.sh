#!/bin/bash

# ===== CONFIGURAÇÕES =====
USER="dikma"                      # Seu usuário no servidor
SERVER="10.3.22.206"              # IP do servidor
APP_DIR="/var/www/nowaste-front-end"  # Pasta do projeto no servidor
CONTAINER_NAME="nowaste-front-end"    # Nome do container
IMAGE_NAME="nowaste-front-end"        # Nome da imagem

echo "==== Iniciando deploy para $SERVER ===="

# ===== 1. Enviar arquivos para o servidor =====
echo "Copiando arquivos para o servidor..."
scp -r . $USER@$SERVER:$APP_DIR

# ===== 2. Conectar via SSH e reconstruir imagem =====
echo "Conectando ao servidor e atualizando container..."
ssh $USER@$SERVER << EOF
  cd $APP_DIR

  echo "Parando container antigo (se existir)..."
  docker stop $CONTAINER_NAME || true
  docker rm $CONTAINER_NAME || true

  echo "Construindo nova imagem..."
  docker build -t $IMAGE_NAME .

  echo "Iniciando novo container..."
  docker run -d -p 9003:18649 --name $CONTAINER_NAME $IMAGE_NAME

  echo "Deploy concluído!"
EOF
