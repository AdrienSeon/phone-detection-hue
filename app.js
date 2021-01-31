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


pingPhone();

function pingPhone() {
    session.pingHost (phoneIp, function (error, target) {
        if (error){
            if (error instanceof ping.RequestTimedOutError){
                if(process.env.NODE_ENV === 'development') {
                    console.log (target + ": Not alive");
                };
                occupancy = "away";
                firstOccupancy = true;
                setTimeout(pingPhone, awayRepeatTimer*1000);
            }
            else{
                if(process.env.NODE_ENV === 'development') {
                    console.log (target + ": " + error.toString ());
                };
                occupancy = "away";
                firstOccupancy = true;
                setTimeout(pingPhone, awayRepeatTimer*1000);
            }
        } else {
            if(process.env.NODE_ENV === 'development') {
                console.log (target + ": Alive");
            };
            occupancy = "home";
            if(firstOccupancy) {
                lightsOn();
                firstOccupancy = false;
            }
            setTimeout(pingPhone, homeRepeatTimer*1000);
        }
        if(process.env.NODE_ENV === 'development') {
            console.log(occupancy);
        };
    })
;}


function lightsOn() {
    // id: 8 = lampe de la télé
    hue.createLocal(host).connect(USERNAME)
        .then(api => {
            const state = new LightState().on()
            return api.lights.setLightState(8, state);
        })
    ;

    // id: 9 = bandeau
    hue.createLocal(host).connect(USERNAME)
        .then(api => {
            const state = new LightState().on()
            return api.lights.setLightState(9, state);
        })
    ;

    // id: 1 = Groupe Salon
    hue.createLocal(host).connect(USERNAME)
        .then(api => {
            const salonState = new GroupLightState()
                .on()
                .brightness(100);
            return api.groups.setGroupState(1, salonState);
        })
    ;
}

