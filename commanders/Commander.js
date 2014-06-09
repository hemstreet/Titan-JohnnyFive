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

            options.board.pinMode(options.pin, five.Pin.INPUT);

            options.board.digitalRead(options.pin, function (value) {
                console.log(value);
            }.bind(this));

        },
        digitalWrite: function (options) {
            options.board = this.parent.board;

            // Set pin to OUTPUT mode
            options.board.pinMode(options.pin, five.Pin.OUTPUT);

            options.board.digitalWrite(options.pin, options.value);

        },
        analogRead:   function (options) {
            options.board = this.parent.board;

            options.board.pinMode(options.pin, five.Pin.ANALOG);

            options.board.analogRead(options.pin, function(value) {
                console.log(value);
            }.bind(this));


        },
        analogWrite:  function (options) {
            options.board = this.parent.board;

            options.board.pinMode(options.pin, five.Pin.PWM);
            options.board.analogWrite(options.pin, 255);

        },
        led:          function (options) {
            options.board = this.parent.board;
            this.myLed = new five.Led(options);

            this.myLed.on();

            setTimeout(function () {
                this.myLed.off();
            }.bind(this), 2000);
        },
        button:       function (options) {
            options.board = this.parent.board;

            this.myButton = new five.Button(options.pin);

            this.myButton.on("down", function () {
                console.log("down");
            });

            this.myButton.on("hold", function () {
                console.log("hold");
            });

            this.myButton.on("up", function () {
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
        irDistance:   function (options) {
            options.board = this.parent.board;

            this.distance = new five.IR.Distance(options);

            this.distance.on("data", function () {
                if (options.board) {
                    console.log("inches: ", this.inches);
                    console.log("cm: ", this.cm, this.raw);
                } else {
                    console.log("value: ", this.value);
                }
            });
        },
        joystick:     function (options) {
            options.board = this.parent.board;

            // Joystick pins are an ledarray of pins
            // Pin orders:
            //   [ up, down, left, right ]
            //   [ ud, lr ]
            this.myJoystick = new five.Joystick({
                pins: [options.x, options.y],
                freq: options.freq
            });

            this.myJoystick.on("axismove", function (err, timestamp) {

                console.log("input", this.axis);
                console.log("LR:", this.axis.x, this.normalized.x);
                console.log("UD:", this.axis.y, this.normalized.y);
                console.log("MAG:", this.magnitude);

            });
        },
        servo:        function (options) {
            options.board = this.parent.board;
            this.myServo = new five.Servo(options);
            this.myServo.center();
            this.myServo.to(90);
        },
        motor:        function (options) {

            options.board = this.parent.board;

            this.myMotor = new five.Motor(options);
            // "start" events fire when the motor is started.
            this.myMotor.on("start", function (err, timestamp) {
                console.log("start", timestamp);

                // Demonstrate motor stop in 2 seconds
                options.board.wait(5000, function () {
                    this.myMotor.stop();
                }.bind(this));

            }.bind(this));

            // "stop" events fire when the motor is started.
            this.myMotor.on("stop", function (err, timestamp) {
                console.log("stop", timestamp);
            });

//            Motor API

            // start()
            // Start the motor. `isOn` property set to |true|
            this.myMotor.start();

        },
        motion:       function (options) {
            options.board = this.parent.board;

            this.myMotion = new five.IR.Motion(options);

            // "calibrated" occurs once, at the beginning of a session,
            this.myMotion.on("calibrated", function (err, ts) {
                console.log("calibrated", ts);
            });

            // "motionstart" events are fired when the "calibrated"
            // proximal area is disrupted, generally by some form of movement
            this.myMotion.on("motionstart", function (err, ts) {
                console.log("motionstart", ts);
            });

            // "motionstart" events are fired following a "motionstart event
            // when no movement has occurred in X ms
            this.myMotion.on("motionend", function (err, ts) {
                console.log("motionend", ts);
            });
        }
    });
});