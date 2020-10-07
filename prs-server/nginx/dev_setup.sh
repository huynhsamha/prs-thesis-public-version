#!/bin/bash

SITES=( \
    'dev.prs.com' \
    'api.dev.prs.com' \
    'admin.dev.prs.com' \
    'editor.dev.prs.com' \
)

SITE_AVAILABLE=/etc/nginx/sites-available
SITE_ENABLED=/etc/nginx/sites-enabled

ENTRY_PATH=`readlink -f $0`
CURR_PATH=`dirname $ENTRY_PATH`

# Function to display commands
exe() { echo "\$ $@" ; "$@" ; }

config_site() {
    echo "Site: $site"
    echo "==========================================="
    
    CONFIG_FILE="$CURR_PATH/dev/$site.cfg"
    AVAILABLE_FILE="$SITE_AVAILABLE/$site"
    ENABLED_FILE="$SITE_ENABLED/$site"

    echo "Config file       : $CONFIG_FILE"
    echo "Site availabled   : $AVAILABLE_FILE"
    echo "Site enabled      : $ENABLED_FILE"

    echo "Remove old files"
    exe sudo rm -rf $AVAILABLE_FILE
    exe sudo rm -rf $ENABLED_FILE

    echo "Copy config file to $SITE_AVAILABLE"
    exe sudo cp $CONFIG_FILE $AVAILABLE_FILE

    echo "Enable site"
    exe sudo ln -s $AVAILABLE_FILE $ENABLED_FILE
    echo "Done"
    echo "==========================================="
    echo ""
    echo ""
}

for site in ${SITES[@]}; do
    config_site
done

echo "==========================================="
echo ""
echo "Please restart NGINX to enable changes:"
echo ""
echo "       sudo service nginx restart"
echo ""
echo "==========================================="
echo ""
echo ""
