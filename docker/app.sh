#!/bin/bash

if [ $# -lt 1 ] ; then
echo "Enter the name of project!"
    exit;
fi

DIR=$(readlink -f `dirname $0`)
PROJ=$1
PORT=$2

WD=`pwd`

cd /home/docker/shell &&
bash build.sh $DIR $PROJ &&
bash run.sh $DIR $PROJ $PORT

cd $WD

exit 0
