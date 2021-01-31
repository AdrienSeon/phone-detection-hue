const ping = require ("net-ping");
const v3 = require('node-hue-api').v3;

const phoneIp = '192.168.1.34';
const session = ping.createSession();
let occupancy = "away";
let firstOccupancy = true;
const awayRepeatTimer = 10;
const homeRepeatTimer = 900;

const hue = v3.api 
const host = "192.168.1.21"
const USERNAME = 'rxTnoKgRp7EzTU7vyJqUpR3bg-SqWdcxHZpMp-9Z'
const GroupLightState = v3.lightStates.GroupLightState;
const LightState = v3.lightStates.LightState;


doPing();

function doPing() {
    session.pingHost (phoneIp, function (error, target) {
        if (error){
            if (error instanceof ping.RequestTimedOutError){
                // console.log (target + ": Not alive");
                occupancy = "away";
                firstOccupancy = true;
                setTimeout(doPing, awayRepeatTimer*1000);
            }
            else{
                // console.log (target + ": " + error.toString ());
                occupancy = "away";
                firstOccupancy = true;
                setTimeout(doPing, awayRepeatTimer*1000);
            }
        } else {
            // console.log (target + ": Alive");
            occupancy = "home";
            if(firstOccupancy) {
                lightsOn();
                firstOccupancy = false;
            }
            setTimeout(doPing, homeRepeatTimer*1000);
        }
        // console.log(occupancy)
    });
}


function lightsOn() {
    // id: 8 = lampe de la télé
    hue.createLocal(host).connect(USERNAME)
    .then(api => {
        // Using a LightState object to build the desired state
        const state = new LightState().on()
        return api.lights.setLightState(8, state);
    })
    ;

    // id: 9 = bandeau
    hue.createLocal(host).connect(USERNAME)
    .then(api => {
        // Using a LightState object to build the desired state
        const state = new LightState().on()
        return api.lights.setLightState(9, state);
    })
    ;

    // id: 1 = Groupe Salon
    hue.createLocal(host).connect(USERNAME)
    .then(api => {
        const salonState = new GroupLightState()
            .on()
            .brightness(100)
        ;
        return api.groups.setGroupState(1, salonState);
    })
    ;
}

