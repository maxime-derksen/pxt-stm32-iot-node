

//% weight=100 color=#0fbc11 icon=""
namespace DistanceSonar {

    let connected = false;
    let TRIG: DigitalPin;
    let ECHO: DigitalPin;

    //% block
    //% blockId=connect_sonar block="connecter le capteur Ultrason %TRIG_ %ECHO_"
    //% parts="DistanceSonar"
    //% weight=26
    export function connectSonar(TRIG_: DigitalPin, ECHO_: DigitalPin) {
        TRIG = TRIG_;
        ECHO = ECHO_;
        connected = true;
    }


    /**
    * Get the distance.
    */
    //% block
    //% blockId=distance_sonar_with_time block="distance (capteur Ultrason) en %unit"
    //% parts="DistanceSonar"
    //% weight=26
    export function distanceSonarWithTime(unit: DistanceUnitWithTime): number {
        if (connected === true) {
            switch (unit) {
                case DistanceUnitWithTime.PicoSecond:
                case DistanceUnitWithTime.NanoSecond:
                case DistanceUnitWithTime.MicroSecond:
                case DistanceUnitWithTime.MilliSecond:
                case DistanceUnitWithTime.MilliSecond:
                    return timeSonar(unit);
                case DistanceUnitWithTime.Millimeter:
                case DistanceUnitWithTime.Centimeter:
                case DistanceUnitWithTime.Decimeter:
                case DistanceUnitWithTime.Meter:
                    return distanceSonar(unit);
            }
            return -100;
        }
        return 0;
    }


    function timeSonarInUs(TRIG_: DigitalPin, ECHO_: DigitalPin) {
        TRIG_.digitalWrite(true);
        control.waitMicros(10);
        TRIG_.digitalWrite(false);
        let timeInUs = ECHO_.pulseIn(PulseValue.High);
        return timeInUs;
    }

    function timeSonar(unit: DistanceUnitWithTime): number {
        let timeInUs = timeSonarInUs(TRIG, ECHO);
        switch (unit) {
            case DistanceUnitWithTime.PicoSecond:
                return timeInUs * 1E6;
            case DistanceUnitWithTime.NanoSecond:
                return timeInUs * 1E3;;
            case DistanceUnitWithTime.MicroSecond:
                return timeInUs;
            case DistanceUnitWithTime.MilliSecond:
                return timeInUs * 1E-3;
            case DistanceUnitWithTime.MilliSecond:
                return timeInUs * 1E-6;
        }
        return -1;
    }

    function distanceSonar(unit: DistanceUnitWithTime): number {
        let timeInUs = timeSonarInUs(TRIG, ECHO);
        switch (unit) {
            case DistanceUnitWithTime.Millimeter:
                return timeInUs * 0.5 * 34029E-5;
            case DistanceUnitWithTime.Centimeter:
                return timeInUs * 0.5 * 34029E-6;
            case DistanceUnitWithTime.Decimeter:
                return timeInUs * 0.5 * 34029E-7;
            case DistanceUnitWithTime.Meter:
                return timeInUs * 0.5 * 34029E-8;
        }
        return -10;
    }




}

    

