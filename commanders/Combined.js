/**
 * Reference : https://github.com/rwaldron/johnny-five/tree/master/docs
 *
 */
define(['altair/facades/declare',
    'altair/modules/commandcentral/mixins/_IsCommanderMixin',
    'altair/plugins/node!johnny-five'
], function (declare, _IsCommanderMixin, five) {

    return declare([_IsCommanderMixin], {
        joystickLed:     function (options) {
            options.board = this.parent.board;

            this.myLed = new five.Led(options.led);
            // Joystick pins are an array of pins
            // Pin orders:
            //   [ up, down, left, right ]
            //   [ ud, lr ]
            this.myJoystick = new five.Joystick({
                pins: [options.joystickPinX, options.joystickPinY],
                freq: options.freq
            });

            this.myJoystick.on("axismove", function (err, timestamp) {

                if(this.myLed) {

                    console.log('has led');

                    if( this.myJoystick.axis.x > 0.5) {

                        this.myLed.off();
                    } else {

                        this.myLed.on();
                    }

                }
//
                console.log("input", this.myJoystick.axis);
                console.log("LR:", this.myJoystick.axis.x, this.myJoystick.normalized.x);
                console.log("UD:", this.myJoystick.axis.y, this.myJoystick.normalized.y);
                console.log("MAG:", this.myJoystick.magnitude);

            }.bind(this));
        },
        joystickServo: function(options) {
            options.board = this.parent.board;
            this.servoSensor = new five.Servo(options.servoPin);

            this.myJoystick = new five.Joystick({
                pins: [options.joystickPinX, options.joystickPinY],
                freq: options.freq
            });

            this.myJoystick.on("axismove", function (err, timestamp) {

                // @TODO fix this in the future so that it is mapped correctly
                // now when joystick is pushed left servo angle will get to 0 and make noise
                var outputValue = this.myJoystick.axis.x * 180;

                this.servoSensor.to(outputValue);

            }.bind(this));

        },

        panTilt: function(options) {
            options.board = this.parent.board;
            this.servoSensorPan  = new five.Servo(options.servoPan);
            this.servoSensorTilt = new five.Servo(options.servoTilt);

            this.myJoystick = new five.Joystick({
                pins: [options.joystickPinX, options.joystickPinY],
                freq: options.freq
            });

            this.myJoystick.on("axismove", function (err, timestamp) {

                // @TODO fix this in the future so that it is mapped correctly
                // now when joystick is pushed left servo angle will get to 0 and make noise
                var x = this.myJoystick.axis.x * 180;
                var y = this.myJoystick.axis.y * 180;

                this.servoSensorPan.to(x);
                this.servoSensorTilt.to(y);

            }.bind(this));
        }

    });
});