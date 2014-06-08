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

            this._led = new five.Led(options.led);
            // Joystick pins are an array of pins
            // Pin orders:
            //   [ up, down, left, right ]
            //   [ ud, lr ]
            this._joystick = new five.Joystick({
                pins: [options.joystickPinX, options.joystickPinY],
                freq: options.freq
            });

            this._joystick.on("axismove", function (err, timestamp) {

                if(this._led) {

                    console.log('has led');

                    if( this._joystick.axis.x > 0.5) {

                        this._led.off();
                    } else {

                        this._led.on();
                    }

                }
//
                console.log("input", this._joystick.axis);
                console.log("LR:", this._joystick.axis.x, this._joystick.normalized.x);
                console.log("UD:", this._joystick.axis.y, this._joystick.normalized.y);
                console.log("MAG:", this._joystick.magnitude);

            }.bind(this));
        }
    });
});