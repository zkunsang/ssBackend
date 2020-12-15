ssh ConnectionSSH <<EOF
  cd /app/backend
  git pull
  npm i
  pm2 restart all
  exit
EOF
