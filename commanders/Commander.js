/**
 * Reference : https://github.com/rwaldron/johnny-five/tree/master/docs
 *
 */
define(['altair/facades/declare',
    'altair/modules/commandcentral/mixins/_IsCommanderMixin',
    'altair/plugins/node!johnny-five'
], function (declare, _IsCommanderMixin, five) {

    return declare([_IsCommanderMixin], {
        digitalRead:  function (options) {
            options.board = this.parent.board;

            options.board.digitalRead(options.pin, function (value) {
                console.log('inside');
                console.log(value);
            }.bind(this));

        },
        digitalWrite: function (options) {
            options.board = this.parent.board;

            // Set pin to OUTPUT mode
            options.board.pinMode(options.pin, 1);

            options.board.digitalWrite(options.pin, 1);

        },
        analogRead:   function (options) {
            options.board = this.parent.board;

//            this.pin = new five.Pin(options.pin);
//
////            this.pin.query(function(state) {
////                console.log(state);
////            }.bind(this));
//
//            this.board.analogRead(options.pin, function(value) {
//                console.log(value);
//            }.bind(this));


        },
        analogWrite:  function (options) {
            options.board = this.parent.board;

            options.board.analogWrite(options.pin, 255);

        },
        led:          function (options) {
            options.board = this.parent.board;
            this._led = new five.Led(options);

            this._led.pulse();
        },
        button:       function (options) {
            options.board = this.parent.board;

            this._button = new five.Button(options.pin);

            this._button.on("down", function () {
                console.log("down");
            });

            this._button.on("hold", function () {
                console.log("hold");
            });

            this._button.on("up", function () {
                console.log("up");
            });
        },
        pulse:        function (options) {

            options.board = this.parent.board;
            this.ping = new five.Ping(options);
            this.ping.on('data', function (median) {
                console.log(this.ping.inches, median);
            }.bind(this));
        },
        irDistance: function(options) {
            options.board = this.parent.board;

            this.distance = new five.IR.Distance(options);

            this.distance.on("data", function() {
                if (options.board) {
                    console.log("inches: ", this.inches);
                    console.log("cm: ", this.cm, this.raw);
                } else {
                    console.log("value: ", this.value);
                }
            });
        },
        joystick: function(options) {
            options.board = this.parent.board;

            this._joystick = new five.Joystick({

                // Joystick pins are an array of pins
                // Pin orders:
                //   [ up, down, left, right ]
                //   [ ud, lr ]

                pins: [options.x, options.y],
                freq: options.freq
            });

            this._joystick.on("axismove", function(err, timestamp) {

                console.log( "input", this.axis );
                console.log( "LR:", this.axis.x, this.normalized.x );
                console.log( "UD:", this.axis.y, this.normalized.y );
                console.log( "MAG:", this.magnitude );

            });
        },
        servo:        function (options) {
            options.board = this.parent.board;
            this._servo = new five.Servo(options);
            this._servo.center();
            this._servo.to(90);
        },
        motor:        function (options) {

            options.board = this.parent.board;

            this._motor = new five.Motor(options);
            // "start" events fire when the motor is started.
            this._motor.on("start", function (err, timestamp) {
                console.log("start", timestamp);

                // Demonstrate motor stop in 2 seconds
                options.board.wait(3000, function() {
                    this._motor.stop();
                }.bind(this));

            }.bind(this));

            // "stop" events fire when the motor is started.
            this._motor.on("stop", function (err, timestamp) {
                console.log("stop", timestamp);
            });

//            Motor API

            // start()
            // Start the motor. `isOn` property set to |true|
            this._motor.start();

        },
        motion:       function (options) {
            options.board = this.parent.board;

            this._motion = new five.IR.Motion(options);

            // "calibrated" occurs once, at the beginning of a session,
            this._motion.on("calibrated", function (err, ts) {
                console.log("calibrated", ts);
            });

            // "motionstart" events are fired when the "calibrated"
            // proximal area is disrupted, generally by some form of movement
            this._motion.on("motionstart", function (err, ts) {
                console.log("motionstart", ts);
            });

            // "motionstart" events are fired following a "motionstart event
            // when no movement has occurred in X ms
            this._motion.on("motionend", function (err, ts) {
                console.log("motionend", ts);
            });
        }
    });
});