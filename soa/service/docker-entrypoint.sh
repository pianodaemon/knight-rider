#!/bin/bash

LOG_DIR=$APP_DIR/logs
mkdir $LOG_DIR

# Prepare log files and start outputting logs to stdout
touch $LOG_DIR/gunicorn.log
touch $LOG_DIR/access.log
tail -n 0 -f $LOG_DIR/*.log &

echo "Starting nginx & gunicorn"

exec gunicorn wsgi \
    --name mcmpdb \
    --bind unix:rproxy.sock \
    --workers 3 \
    --log-level=info \
    --log-file=$LOG_DIR/gunicorn.log \
    --access-logfile=$LOG_DIR/access.log &

/usr/sbin/nginx -g "daemon off;"
