#include "pxt.h"
#include "target_humidity.h"

enum class HumidityCondition {
    //% block="wet"
    Wet = ANALOG_THRESHOLD_HIGH,
    //% block="dry"
    Dry = ANALOG_THRESHOLD_LOW
};

namespace pxt {
SINGLETON(WHum);
}

namespace input {

/**
* Run some code when the humidity changes from dry to wet, or from wet to dry.
* @param condition the condition, wet or dry, the event triggers on
* @param humidity the humidity at which this event happens, eg: 50
* @param unit the unit of the humidity
*/
//% blockId=input_on_humidity_condition_changed block="on humidity %condition|at %humidity percent"
//% help=input/on-humidity-condition-changed blockExternalInputs=0
//% parts="humidity"
//% group="More" weight=76
void onHumidityConditionChanged(HumidityCondition condition, int humidity, Action handler) {
    auto sensor = &getWHum()->sensor;
    sensor->updateSample();

    float t = humidity*10.;

    if (condition == HumidityCondition::Dry)
        sensor->setLowThreshold(t);
    else
        sensor->setHighThreshold(t);
    registerWithDal(sensor->id, (int)condition, handler);
}

/**
 * Get the relative humidity in percent.
 */
//% help=input/humidity
//% blockId=device_humidity block="relative humidity in percent"
//% parts="humidity"
//% weight=26
int humidity() {
    return (int) getWHum()->sensor.getValue()/10.;
}
}
