# Xml to Redis Importer

A commandl ine utility to import key value pair form XML file to Redis

From root of the folder execute the following command to build docker images and containers.
```
docker-compose up -d
```

After the containers have started, run the following command to log into the container
```
docker-compose run app /bin/sh
```

When logged into the shell of container, run the following command to start the import of the XML file to Redis
```
node export.js -p config.xml -v
```

option __-p__ is required as it is the path of the file to import and option __-v__ is optional, when present will display all the keys being imported

To perform unit test execute the following command from the container shell
```
npm run test
```