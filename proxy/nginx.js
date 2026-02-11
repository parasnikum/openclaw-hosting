const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const sitesAvailable = "/etc/nginx/sites-available";
const sitesEnabled = "/etc/nginx/sites-enabled";

function isValidDomain(domain) {
    if (!domain || domain.length > 253) return false;
    domain = domain.toLowerCase().trim();
    const regex = /^(?!-)(?:[a-z0-9-]{1,63}\.)+[a-z]{2,63}$/;
    return regex.test(domain);
}

function isValidPort(port) {
    return Number.isInteger(port) && port > 0 && port <= 65535;
}

exports.createConfig = async (domainName, ip, port) => {
    if (!isValidDomain(domainName)) {
        throw new Error("Invalid domain name");
    }

    if (!isValidPort(port)) {
        throw new Error("Invalid port");
    }

    const config = `
server {
    listen 80;
    server_name ${domainName} www.${domainName};
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${domainName} www.${domainName};

    ssl_certificate /etc/ssl/certs/${domainName}.crt;
    ssl_certificate_key /etc/ssl/private/${domainName}.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_session_cache shared:SSL:10m;

    location / {
        proxy_pass http://${ip}:${port};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
`;

    const availablePath = path.join(sitesAvailable, `${domainName}.conf`);
    const enabledPath = path.join(sitesEnabled, `${domainName}.conf`);

    try {
        // Write config
        fs.writeFileSync(availablePath, config);

        // Create symlink if not exists
        if (!fs.existsSync(enabledPath)) {
            fs.symlinkSync(availablePath, enabledPath);
        }

        // Test nginx config
        await new Promise((resolve, reject) => {
            exec("nginx -t", (err, stdout, stderr) => {
                if (err) {
                    reject(stderr);
                } else {
                    resolve();
                }
            });
        });

        // Reload only if test passed
        await new Promise((resolve, reject) => {
            exec("nginx -s reload", (err, stdout, stderr) => {
                if (err) {
                    reject(stderr);
                } else {
                    resolve();
                }
            });
        });

        console.log("Nginx reloaded successfully");
        return true;

    } catch (error) {

        console.error("Nginx failed:", error);

        // 🔥 Rollback changes
        if (fs.existsSync(enabledPath)) {
            fs.unlinkSync(enabledPath);
        }

        if (fs.existsSync(availablePath)) {
            fs.unlinkSync(availablePath);
        }

        throw new Error("Nginx config failed and was rolled back.\n" + error);
    }
};
