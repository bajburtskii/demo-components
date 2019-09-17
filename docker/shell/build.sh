#!/bin/bash

DIR=$1
PROJ=$2

echo 'Building image with apache and php...'
docker build -t $PROJ/dev $DIR/$PROJ

ret=$?

exit $ret
