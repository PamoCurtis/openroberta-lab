// This file is automatically generated by the Open Roberta Lab.

#include <Arduino.h>

#include <NEPODefs.h>

void ____control();
void ____logic();

double ___numberVar;
bool ___booleanVar;
String ___stringVar;
unsigned int ___colourVar;
std::list<double> ___numberList;
std::list<bool> ___booleanList;
std::list<String> ___stringList;
std::list<unsigned int> ___colourList;
int _led_L = 13;

void ____control() {
    if ( ___booleanVar ) {
    } else if ( ___booleanVar ) {
    }
    if ( ___booleanVar ) {
    } else if ( ___booleanVar ) {
    }
    while ( true ) {
        delay(1);
    }
    for (int ___k0 = 0; ___k0 < ___numberVar; ___k0 += 1) {
        delay(1);
    }
    for (int ___i = ___numberVar; ___i < ___numberVar; ___i += ___numberVar) {
        delay(1);
    }
    while ( true ) {
        break;
        delay(1);
    }
    while ( true ) {
        continue;
        delay(1);
    }
    delay(___numberVar);
    while ( ! ___booleanVar ) {
        delay(1);
    }
    while ( ___booleanVar ) {
        delay(1);
    }
    for ( double ___item : ___numberList ) {
        delay(1);
    }
    for ( bool ___item2 : ___booleanList ) {
        delay(1);
    }
    for ( String ___item3 : ___stringList ) {
        delay(1);
    }
    for ( unsigned int ___item4 : ___colourList ) {
        delay(1);
    }
    while (true) {
        if ( ___booleanVar ) {
            break;
        }
        if ( ___booleanVar ) {
            break;
        }
        delay(1);
    }
    while (true) {
        if ( ___booleanVar ) {
            break;
        }
        delay(1);
    }
}

void ____logic() {
    Serial.println(___numberVar == ___numberVar);
    Serial.println(___numberVar != ___numberVar);
    Serial.println(___numberVar < ___numberVar);
    Serial.println(___numberVar <= ___numberVar);
    Serial.println(___numberVar > ___numberVar);
    Serial.println(___numberVar >= ___numberVar);
    Serial.println(___booleanVar && ___booleanVar);
    Serial.println(___booleanVar || ___booleanVar);
    Serial.println(! ___booleanVar);
    Serial.println(true);
    Serial.println(false);
    Serial.println(NULL);
    Serial.println(( ( ___booleanVar ) ? ( ___numberVar ) : ( ___numberVar) ));
}

void setup()
{
    Serial.begin(9600);
    pinMode(_led_L, OUTPUT);
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
    ____control();
    ____logic();
}