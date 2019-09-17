#!/bin/bash

DIR=$1
PROJ=$2
PORT=$3

echo 'Launch apache and php...'
docker run -tid --name $PROJ \
	--restart="on-failure:3" \
	-p $PORT:80 \
	-v /var/www/$PROJ:/var/www/html \
	--link mysqlserver:mysqldb \
	$PROJ/dev

ret=$?

exit $ret
