Follow https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx

```bash
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
sudo certbot certonly --nginx --renew-by-default -d 'prs.hcmutchain.net' -d 'api.prs.hcmutchain.net' -d 'admin.prs.hcmutchain.net' 

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/prs.hcmutchain.net/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/prs.hcmutchain.net/privkey.pem
   Your cert will expire on 2020-08-17. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
sudo certbot certonly --nginx --renew-by-default -d 'editor.prs.hcmutchain.net' -d 'monitor.prs.hcmutchain.net'

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/editor.prs.hcmutchain.net/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/editor.prs.hcmutchain.net/privkey.pem
   Your cert will expire on 2020-08-17. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
sudo certbot certonly --nginx --renew-by-default -d 'ws.prs.hcmutchain.net'

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/ws.prs.hcmutchain.net/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/ws.prs.hcmutchain.net/privkey.pem
   Your cert will expire on 2020-08-18. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"
```
