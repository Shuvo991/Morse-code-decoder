from bbio import *
from bbio.libraries.BBIOServer import *
from firebase import firebase
fbase = firebase.FirebaseApplication('https://assignment2-ed5b7.firebaseio.com',None)


server = BBIOServer(2428)



def ledState(json):
        info = json["LED"]["state"]
        if info == 1:
                return "ON"
        else:
                return "OFF"
#toggle to turn it off or on
def ledOn(fbase):
        packet = {"state":1}
        fbase.patch('users/LED',packet)
def ledOff(fbase):
        packet = {"state":0}
        fbase.patch('users/LED',packet)
# check the state of the PIR
def Toggle(json,fbase):
        info = json['PIR']['state']
        if info == 1:
                packet = {'status':0}
                fbase.patch('users/PIR',packet)
        else:
                packet = {'status':1}
                fbase.patch('users/PIR',packet)
def reset(fbase): #reseting the server 
        packet = {'smotion': 0, 'lmotion': 0, 'intrusion': 0, 'state': 0}
        fbase.patch('users/PIR',packet)

def pirState(json):
        info = json["PIR"]["state"]
        if info == 1:
                return "ON"
        else:
                return "OFF"
def showShort(json): # show short motion
        return json["PIR"]["smotion"]

def showLong(json): #show long motion
        return json["PIR"]["lmotion"]
def showIntrusion(json): #LLSL
        return json["PIR"]["intrusion"]

def setup(): #setting up the server
        data = fbase.get('users/',None)
        home = Page("Homepage")
        home.add_heading("Welcome to the Intrusion Detector App.")
        home.add_text('Here you can control and LED and PIR motion sensor',newline=True)
        home.add_text('And you can see how many short, long and intrusions detected',newline=True)
        LED = Page("LED Control")
        LED.add_heading("Welcome to the LED Control page")
        LED.add_text("Here you can control the red LED on the BBB",newline=True)
        LED.add_monitor(lambda: ledState(data),"Current LED state",newline=True)
        LED.add_button(lambda: ledOn(fbase), "Turn the LED ON",newline=True)
        LED.add_button(lambda: ledOff(fbase), "Turn the LED OFF")
        PIR = Page("PIR Motion sensor")
        PIR.add_heading("Welcome to the PIR Sensor page")
        PIR.add_text("Here you can check for intruders and turn on and off your sensor",newline=True)
        PIR.add_button(lambda: Toggle(data,fbase),"Toggle ON and OFF",newline=True)
        PIR.add_button(lambda: reset(fbase),"Reset readings")
        PIR.add_monitor(lambda: pirState(data),"State: ")
        PIR.add_monitor(lambda: showIntrusion(data),"Intrusion",newline=True)
        PIR.add_monitor(lambda: showShort(data),"Short Motion",newline=True)
        PIR.add_monitor(lambda: showLong(data),"Long Motion")


        server.start(home,LED,PIR)
def loop():
        pass
run(setup,loop)




