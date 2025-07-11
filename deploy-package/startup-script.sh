#!/bin/bash
cd /var/www/techpartner
sudo systemctl stop techpartner || true
sudo npm install --production
sudo pm2 delete techpartner || true
sudo pm2 start server.js --name techpartner
sudo pm2 save
sudo systemctl start nginx
