from bbio import *
import time
LED_PIN="GPIO1_12"

pinMode(LED_PIN,OUTPUT)

while True:
        digitalWrite(LED_PIN,HIGH)
        time.sleep(1)
        digitalWrite(LED_PIN,LOW)
        time.sleep(1)
