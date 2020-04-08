enum DistanceHCSR04Condition {
    //% block="far"
    Far = SENSOR_THRESHOLD_HIGH,
    //% block="near"
    Near = SENSOR_THRESHOLD_LOW
}


enum PingUnit {
    //% block="μs"
    MicroSeconds,
    //% block="mm"
    Millimeter,
    //% block="cm"
    Centimeter,
    //% block="dm"
    Decimeter,
    //% block="m"
    Meter
}


namespace pxt {
    //SINGLETON(WDistance);
    }
    
namespace input {

    /**
    * Send a ping and get the echo time (in microseconds) as a result
    * @param trig tigger pin
    * @param echo echo pin
    * @param unit desired conversion unit
    * @param maxCmDistance maximum distance in centimeters (default is 500)
    */
    function ping(trig: DigitalPin, echo: DigitalPin, unit: PingUnit, maxCmDistance = 500): number {
    

        // send pulse
        pins.setPull(trig, PinPullMode.PullNone);
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);

        // read pulse   
        const d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);

    
            switch (unit) {
                case PingUnit.Millimeter:
                    d = distance;
                    break;
                case PingUnit.Centimeter:
                    d = distance * 10;
                    break;
                case PingUnit.Decimeter:
                    d = distance * 100;
                    break;
                case PingUnit.Meter:
                    d = distance * 1000;
                    break;
                default:
                    d = 0;
                    break;
            }

            if (condition == DistanceHCSR04Condition.Near)
                sensor.setLowThreshold(d)
            else
                sensor.setHighThreshold(d)
            registerWithDal(sensor.id, (int)condition, handler)
        }

        /**
         * Get the distance.
         */
        //% help=input/distance
        //% blockId=device_distance block="distance in %unit"
        //% parts="distance"
        //% weight=26
        function distance(unit: PingUnit): number {
    
            int distance = getWDistance().sensor.getValue();
    
            switch (unit) {
                case PingUnit.Millimeter:
                    return distance
                case PingUnit.Centimeter:
                    return distance / 10.
                case PingUnit.Decimeter:
                    return distance / 100.
                case PingUnit.Meter:
                    return distance / 1000.
                default:
                    return 0
            }
        }
    }
}