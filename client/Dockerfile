FROM nginx

RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs
RUN npm install -g @ionic/cli@7.1.1
COPY ./temp-it /usr/src/app
WORKDIR /usr/src/app
RUN npm install
RUN ionic build --prod
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN cp -R /usr/src/app/www/* /usr/share/nginx/html

EXPOSE 80