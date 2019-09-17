#!/bin/bash

echo 'Launch pma...'
docker run --name pma -d \
	--link mysqlserver:mysqldb \
	-p 8080:80 \
	-e PMA_HOST=mysqldb \
	phpmyadmin/phpmyadmin

ret=$?

exit $ret