from bbio import *
from firebase import firebase
ledPin = "GPIO1_12"
pirInput = "GPIO1_13"
LED = None
PIR = None
pirState = 1
pirCounter = 0
LEDstate = 0
index = 0       #will be used for intrusion pattern matching
Intrusion = ''
account = 'https://assignment2-ed5b7.firebaseio.com'
fbase = firebase.FirebaseApplication(account,None)

def checkIntrusion(json):
        global Intrusion
        global index
        pattern = 'LSLL'
        if Intrusion == ' ':
                print 'HIT PASS'
                pass

        elif Intrusion == pattern[index]:
                index += 1
                Intrusion = ' '
                if index == 4:
                        PIR['intrusion'] += 1
                        index = 0
        else:
                index = 0
                Intrusion = ' '

def PIRProbe(PIN):
        global pirState
        global PIR
        global pirCounter
        global Intrusion
        if (PIR['state'] == 1):                    # if the switch is on 
                if pinState(PIN) and (pirState == 1):           # if the state is high$
                        pirState = 0
                        pirCounter += 1
                elif (pinState(PIN)) and (pirState == 0):       # if the PIR signal is$
                        pirCounter += 1                         #There is still motion$

                elif (not pinState(PIN)) and (pirState == 0):   # if the motion signal$
                        if (pirCounter >=  2):
                                PIR['lmotion'] += 1
                                Intrusion = 'L'
                        elif (pirCounter > 0):
                                PIR['smotion'] += 1
                                Intrusion = 'S'
                        pirCounter = 0                   # The motioin just ended

        else:
                pass          # if the switch is off 


def setup():
        pinMode(ledPin,OUTPUT)
        pinMode(pirInput,INPUT,-1)

def loop(): #loop to continuosly get the data
        global Intrusion
        global index
        global LEDstate
        global LED
        global PIR
        global pirInput
        result = fbase.get('users/',None)
        PIR = result['PIR']
        LED = result['LED']
        if LED['state'] == 1 and LEDstate == 0:
                digitalWrite(ledPin,HIGH)
                LEDstate = 1
        elif LED['state']==0 and LEDstate == 1:
                digitalWrite(ledPin,LOW)
                LEDstate = 0
        PIRProbe(pirInput)
        checkIntrusion(PIR)
        result = fbase.patch('users/PIR',PIR)


run(setup,loop)


