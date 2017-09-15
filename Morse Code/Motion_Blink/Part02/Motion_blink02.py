                                                                                                                                 

from bbio import *
from bbio.libraries.BBIOServer import *

server = BBIOServer(4455)

LED_PIN="GPIO1_12"     # This is your LED pin (current = P8_12)
PIR_INPUT="GPIO1_13"   # This is your PIR pin (current = P8_11)
pirState = 1
pirCounter = 0
pirSwitch= 1
pirLongM = 0
pirShortM = 0
def LEDstate(PIN):
        if (pinState(PIN)):
                return "LED is On"
        return "LED is Off"

def PIRProbe(PIN):
        global pirLongM
        global pirShortM
        global pirSwitch
        global pirState
        global pirCounter
        if (pirSwitch == 1):                    # if the switch is on 
                if pinState(PIN) and (pirState == 1):           # if the state is high and the PIR signal is high
                        pirState = 0
                        pirCounter += 1
                        return "Motion Detected!!"
                elif (pinState(PIN)) and (pirState == 0):       # if the PIR signal is high but the state is low
                        pirCounter += 1                         #There is still motion going on
                        return "Motion Detected!!"
                elif (not pinState(PIN)) and (pirState == 0):   # if the motion signal is low and the state is low
                        if (pirCounter > 20):
                                pirLongM += 1
                        elif (pirCounter > 0):
                                pirShortM += 1
                        pirCounter = 0
                        return "Motion ended"           # The motioin just ended

        else:
                return "Sensor is OFF"          # if the switch is off 
def Toggle():# toggle a global variable (pirSwitch) 0 and 1
        global pirSwitch
        x = 1
        pirSwitch = x - pirSwitch

def reset():    # set both global vars to 0
        global pirShortM
        global pirLongM
        pirShortM = 0
        pirLongM = 0
def showShort():
        global pirShortM
        return pirShortM
def showLong():
        global pirLongM
        return pirLongM
                                                   

def setup():
        pinMode(LED_PIN,OUTPUT)
        pinMode(PIR_INPUT,INPUT,-1)
        home = Page("Homepage")
        home.add_heading("Welcome to the BeagleBone Black page.")
        home.add_text('Here you can turn an LED on the BBB ON and OFF',newline = True)
        home.add_text('Or you can check if there is someone moving around the BBB',newline = True)
        LED = Page("LED Control")
        LED.add_heading("Welcome to the LED Control page")
        LED.add_text("Here you can control the red LED on the BBB",newline=True)
        LED.add_monitor(lambda: LEDstate(LED_PIN),"Current LED state",newline=True)
        LED.add_button(lambda: digitalWrite(LED_PIN,HIGH), "Turn the LED ON",newline=True)
        LED.add_button(lambda: digitalWrite(LED_PIN,LOW), "Turn the LED OFF")
        PIR = Page("PIR Motion sensor")
        PIR.add_heading("Welcome to the PIR Sensor page")
        PIR.add_text("Here you can turn the PIR ON and OFF",newline=True)
        PIR.add_button(lambda: Toggle(),"Toggle ON and OFF",newline=True)
        PIR.add_button(lambda: reset(),"Reset readings")
        PIR.add_monitor(lambda: PIRProbe(PIR_INPUT),"State: ",newline=True)
        PIR.add_monitor(lambda: showShort(),"Short Motion",newline=True)
        PIR.add_monitor(lambda: showLong(),"Long Motion")



        server.start(home,LED,PIR)

def loop():
        pass

run(setup,loop)

