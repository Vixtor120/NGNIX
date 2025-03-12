# Redirigir HTTP a HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name sitioweb.com www.sitioweb.com;
    return 301 https://$host$request_uri;
}

# Configuración HTTPS
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name sitioweb.com www.sitioweb.com;

    ssl_certificate /etc/ssl/certs/sitioweb.crt;
    ssl_certificate_key /etc/ssl/private/sitioweb.key;

    root /var/www/sitioweb/html;
    index index.php index.html index.htm;

    # Ruta para archivos PHP
    location / {
        try_files $uri $uri/ =404;
    }

    # Manejo de archivos PHP
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Node.js
    location /nodeapp/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Área segura con autenticación
    location /secure/ {
        auth_basic "Acceso Restringido";
        auth_basic_user_file /etc/nginx/.htpasswd;
        root /var/www;
        index index.html;
    }

    access_log /var/log/nginx/sitioweb_access.log;
}
