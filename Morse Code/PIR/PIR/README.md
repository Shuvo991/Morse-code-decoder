assignment-2-team93 created by GitHub Classroom

Packages: 
Before you start, please ensure that the following software and libraries are installed on the BeagleBone Black
 1- Python 2
 2- PyBBIO library from here >>https://github.com/graycatlabs/PyBBIO
 3- python-firebase from here >> https://github.com/ozgur/python-firebase

Structure and Functions:
This project allows the beaglebone to post its PIR sensor data and LED status to the Firebase database using server.py then allows any other beaglebone devices to be able to host a web app that shows the data uploaded to the firebase and allows users to modify those data using app.py

Current settings and PIN layout currently the webpage that will be hosted by app.py will be at localhost port:2428
 in case you want to change the port please modify the xxxx in the app.py in the following line into your desired port number
 server = BBIOServer(xxxx)

PIN layout:
in case you want to change the pin that is connected to the sensor and LED please modify the string in the following codes in case you wish to change it please follow the PyBBIO pin layout scheme at https://github.com/graycatlabs/PyBBIO/wiki

ledPin = "GPIO1_12" << this is the current pin which is equivelent to "P08_12" 
pirInput = "GPIO1_13" << this is the current PIR input pin which is equivelent to "P08_11"
"P09_01" is used to connect the ground of the LED 
"P09_02" is used to connect the PIR sensor ground 
"P09_08" is used to power up the PIR sensor with 5v << please make sure to plut in to this pin

Getting started:
 1- Ensure that all the mentioned libraries exist in your beaglebone
 2- Ensure your beaglebone is able to connect to the internet
 3- run server.py on the beaglebone connected to the sensor by typing: python server.py
 4- run app.py on any beaglebone that by typing: python app.py
 5- run app.py on the beaglebone to connect to the firebase and host a webpage by typing: python server.py

You are set up!
