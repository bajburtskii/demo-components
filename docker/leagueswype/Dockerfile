FROM php:7.1-apache

#Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

RUN apt-get update

RUN apt-get install -y \
    git \
    cron \
    vim \
    zip \
    mc

COPY php.ini /usr/local/etc/php
COPY default.conf /etc/apache2/sites-available/000-default.conf

# Install pdo_mysql
RUN docker-php-ext-install pdo_mysql

RUN rm /etc/apt/preferences.d/no-debian-php

RUN apt-get update -y \
  && apt-get install -y \
    libxml2-dev \
    php-soap \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libmcrypt-dev \
    libpng-dev \
    imagemagick \
  && apt-get clean -y \
  && docker-php-ext-install soap \
  && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
  && docker-php-ext-install -j$(nproc) gd

RUN pecl install xdebug \
  && docker-php-ext-enable xdebug

RUN a2enmod rewrite && a2enmod headers && a2enmod include && service apache2 restart

# Install composer
RUN curl -sS https://getcomposer.org/installer | php \
        && mv composer.phar /usr/local/bin/composer

COPY crontab /var/spool/cron/crontabs/app
RUN crontab /var/spool/cron/crontabs/app
RUN touch /var/log/cron.log

RUN apt-get install  -y php-mail

WORKDIR /var/www/html

EXPOSE 80

