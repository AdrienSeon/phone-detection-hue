const ping = require ("ping");
const v3 = require('node-hue-api').v3;

const phoneIp = '192.168.1.34';
const awayRepeatTimer = 10;
const homeRepeatTimer = 900;
let firstOccupancy = true;

const hue = v3.api 
const hueBridgeIp = "192.168.1.21"
const USERNAME = 'rxTnoKgRp7EzTU7vyJqUpR3bg-SqWdcxHZpMp-9Z'
const GroupLightState = v3.lightStates.GroupLightState;
const LightState = v3.lightStates.LightState;


pingPhone();

function pingPhone() {
    ping.sys.probe(phoneIp, function(isAlive, error){
        if(isAlive){
            if(process.env.NODE_ENV === 'development') {
                console.log (phoneIp + ": Alive");
            };
            if(firstOccupancy) {
                lightsOn();
                firstOccupancy = false;
            };
            setTimeout(pingPhone, homeRepeatTimer*1000);
        } else {
            if(process.env.NODE_ENV === 'development') {
                console.log (phoneIp + ": not reachable");
            };
            firstOccupancy = true;
            setTimeout(pingPhone, awayRepeatTimer*1000);
        };
    });
;}


function lightsOn() {
    // id: 8 = lampe de la télé
    hue.createLocal(hueBridgeIp).connect(USERNAME)
        .then(api => {
            const state = new LightState().on()
            return api.lights.setLightState(8, state);
        })
    ;

    // id: 9 = bandeau
    hue.createLocal(hueBridgeIp).connect(USERNAME)
        .then(api => {
            const state = new LightState().on()
            return api.lights.setLightState(9, state);
        })
    ;

    // id: 1 = Groupe Salon
    hue.createLocal(hueBridgeIp).connect(USERNAME)
        .then(api => {
            const salonState = new GroupLightState()
                .on()
                .brightness(100);
            return api.groups.setGroupState(1, salonState);
        })
    ;
}

