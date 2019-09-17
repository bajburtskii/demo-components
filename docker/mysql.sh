#!/bin/bash

if [ $# -lt 1 ] ; then
    echo "Specify password"
    exit;
fi

DIR=$(readlink -f `dirname $0`)
PWD=$1

echo 'Launch mysql...'
docker run --name mysqlserver \
	--restart="on-failure:3" \
	-e MYSQL_ROOT_PASSWORD=$PWD \
	-v /var/lib/mysql:/var/lib/mysql \
	-v $DIR/mysql:/etc/mysql/conf.d \
	-d mysql:5.6

ret=$?

exit $ret