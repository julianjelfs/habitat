# Guinea Pig Habitat Monitor

This is a web server designed to run on Raspberry Pi and 
monitor the GPIO temperature data and ping it to connected 
clients using web sockets.

```
npm pack

scp ./habitat-1.0.0.tgz pi@192.168.1.105:/home/pi/projects/tmp

ssh pi@192.168.1.105

gunzip -c habitat-1.0.0.tgz | tar xvf -

cp -a package/. ../habitat/

```

