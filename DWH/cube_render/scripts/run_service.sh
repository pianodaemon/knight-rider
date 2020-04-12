#!/bin/sh

PID_FILE="/tmp/cuberender.pid"

# Pid file is needless in container enviroment
rm -f $PID_FILE

/cuberender -pid-file=$PID_FILE
