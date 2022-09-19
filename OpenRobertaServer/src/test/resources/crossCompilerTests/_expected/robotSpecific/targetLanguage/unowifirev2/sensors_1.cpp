// This file is automatically generated by the Open Roberta Lab.

#include <Arduino.h>

#include <SparkFun_LSM6DS3_Breakout/src/SparkFunLSM6DS3.h>
#include <DHT_sensor_library/DHT.h>
#include <IRremote/src/IRremote.h>
#include <NEPODefs.h>

void ____sensors();
void ____sensorsWaitUntil();

double ___numberVar;
bool ___booleanVar;
String ___stringVar;
unsigned int ___colourVar;
std::list<double> ___numberList;
std::list<bool> ___booleanList;
std::list<String> ___stringList;
std::list<unsigned int> ___colourList;
int _input_S3 = 1;
LSM6DS3 _imu_A(SPI_MODE, SPIIMU_SS);
int _output_P2 = A2;
int _output_B = 7;
int _output_L2 = A3;
#define DHTPINL3 2
#define DHTTYPE DHT11
DHT _dht_L3(DHTPINL3, DHTTYPE);
LSM6DS3 _imu_G(SPI_MODE, SPIIMU_SS);
IRrecv _irrecv_I(11);
int _SensorPin_P = A5;
int _input_S = 0;
int _taster_T = 3;
int _trigger_U = 12;
int _echo_U = 6;
int _TMP36_T2 = A1;
int _input_S2 = A0;
int _S_T3 = A4;
unsigned long __time_1 = millis();
double _getUltrasonicDistance(int trigger, int echo)
{
    digitalWrite(trigger, LOW);
    delay(5);
    digitalWrite(trigger, HIGH);
    delay(10);
    digitalWrite(trigger, LOW);
    return pulseIn(echo, HIGH) * 0.03432/2;
}


void ____sensors() {
    Serial.println(analogRead(_input_S2));
    Serial.println(digitalRead(_input_S));
    Serial.println(digitalRead(_input_S3));
    Serial.println((int) (millis() - __time_1));
    __time_1 = millis();
    Serial.println(digitalRead(_taster_T));
    Serial.println(digitalRead(_output_B));
    Serial.println(analogRead(_output_L2)/10.24);
    
    Serial.println(_dht_L3.readHumidity());
    Serial.println(analogRead(_S_T3)/10.24);
    Serial.println(analogRead(_SensorPin_P));
    Serial.println(((double)analogRead(_output_P2))*5/1024);
    Serial.println(_getUltrasonicDistance(_trigger_U, _echo_U));
    
    
    Serial.println(_imu_G.readFloatGyroX());
    Serial.println(_imu_G.readFloatGyroX());
    Serial.println(_imu_G.readFloatGyroX());
    Serial.println(_imu_A.readFloatAccelX());
    Serial.println(_imu_A.readFloatAccelX());
    Serial.println(_imu_A.readFloatAccelX());
}

void ____sensorsWaitUntil() {
    while (true) {
        if ( analogRead(_input_S2) == 50 ) {
            break;
        }
        delay(1);
    }
    while (true) {
        if ( digitalRead(_input_S) == 1 ) {
            break;
        }
        delay(1);
    }
    while (true) {
        if ( digitalRead(_input_S) == 0 ) {
            break;
        }
        delay(1);
    }
    while (true) {
        if ( digitalRead(_taster_T) == true ) {
            break;
        }
        delay(1);
    }
    while (true) {
        if ( (int) (millis() - __time_1) > 500 ) {
            break;
        }
        delay(1);
    }
    while (true) {
        if ( map(analogRead(_TMP36_T2), 0, 410, -50, 150) < 20 ) {
            break;
        }
        delay(1);
    }
    while (true) {
        if ( _getUltrasonicDistance(_trigger_U, _echo_U) < 30 ) {
            break;
        }
        delay(1);
    }
    while (true) {
        if ( analogRead(_output_L2)/10.24 < 30 ) {
            break;
        }
        delay(1);
    }
    while (true) {
        if ( ((double)analogRead(_output_P2))*5/1024 < 30 ) {
            break;
        }
        delay(1);
    }
    
    
    while (true) {
        if ( _dht_L3.readHumidity() < 30 ) {
            break;
        }
        delay(1);
    }
    while (true) {
        if ( _dht_L3.readTemperature() < 30 ) {
            break;
        }
        delay(1);
    }
    while (true) {
        if ( digitalRead(_output_B) == true ) {
            break;
        }
        delay(1);
    }
    while (true) {
        if ( analogRead(_SensorPin_P) < 30 ) {
            break;
        }
        delay(1);
    }
    while (true) {
        if ( analogRead(_S_T3)/10.24 < 30 ) {
            break;
        }
        delay(1);
    }
    
    
    while (true) {
        if ( _imu_G.readFloatGyroX() < 30 ) {
            break;
        }
        delay(1);
    }
    while (true) {
        if ( _imu_G.readFloatGyroY() < 30 ) {
            break;
        }
        delay(1);
    }
    while (true) {
        if ( _imu_G.readFloatGyroZ() < 30 ) {
            break;
        }
        delay(1);
    }
    while (true) {
        if ( _imu_A.readFloatAccelX() < 30 ) {
            break;
        }
        delay(1);
    }
    while (true) {
        if ( _imu_A.readFloatAccelY() < 30 ) {
            break;
        }
        delay(1);
    }
    while (true) {
        if ( _imu_A.readFloatAccelZ() < 30 ) {
            break;
        }
        delay(1);
    }
}

void setup()
{
    Serial.begin(9600);
    pinMode(_input_S3, INPUT_PULLUP);
    _imu_A.begin();
    pinMode(_output_B, INPUT);
    _dht_L3.begin();
    _imu_G.begin();
    pinMode(13, OUTPUT);
    _irrecv_I.enableIRIn();
    pinMode(_input_S, INPUT);
    pinMode(_taster_T, INPUT);
    pinMode(_trigger_U, OUTPUT);
    pinMode(_echo_U, INPUT);
    pinMode(_input_S2, INPUT);
    ___numberVar = 0;
    ___booleanVar = true;
    ___stringVar = "";
    ___colourVar = RGB(0xFF, 0xFF, 0xFF);
    ___numberList = {0, 0};
    ___booleanList = {true, true};
    ___stringList = {"", ""};
    ___colourList = {RGB(0xFF, 0xFF, 0xFF), RGB(0xFF, 0xFF, 0xFF)};
}

void loop()
{
    ____sensors();
    ____sensorsWaitUntil();
}