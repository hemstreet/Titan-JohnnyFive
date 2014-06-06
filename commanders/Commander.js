/**
 * Reference : https://github.com/rwaldron/johnny-five/tree/master/docs
 *
 */
define(['altair/facades/declare',
    'altair/modules/commandcentral/mixins/_IsCommanderMixin',
    'altair/plugins/node!johnny-five'
], function (declare, _IsCommanderMixin, five) {

    return declare([_IsCommanderMixin], {
        digitalReadPin:  function (options) {
            this.board = this.parent.board;
            console.log(options.pin);
            this.pin = new five.Pin(options.pin);

            // set pin to INPUT mode
            this.board.pinMode(options.pin, 0);

            this.board.digitalRead(options.pin);

        },
        digitalWritePin: function (options) {
            this.board = this.parent.board;

            // Set pin to OUTPUT mode
            this.board.pinMode(options.pin, 1);

            this.board.digitalWrite(options.pin, 1);

        },
        analogWritePin:  function (options) {
            this.board = this.parent.board;

            this.board.pinMode(options.pin, 1);

            this.board.analogWrite(options.pin, 255)

        },
        analogReadPin:  function (options) {
            this.board = this.parent.board;

            this.board.analogRead(options.pin, 255)

        },
        led: function (options) {
            this.board = this.parent.board;
            this._led = new five.Led(options);

            this._led.pulse();
        },
        pulse:           function (options) {

            options.board = this.parent.board;
            this.ping = new five.Ping(options);
            this.ping.on('data', function (median) {
                console.log(this.ping.inches, median);
            }.bind(this));
        },
        servo:           function (options) {
            options.board = this.parent.board;
            this._servo = new five.Servo(options);
            this._servo.center();
            this._servo.to(90);
        },
        motor:           function (options) {
            options.board = this.parent.board;
            this._motor = new five.Motor(options);

            this._motor.start();

        },
        motion:          function (options) {
            options.board = this.parent.board;

            this.sensor = new five.IR.Motion(options);

            // "calibrated" occurs once, at the beginning of a session,
            this.sensor.on("calibrated", function (err, ts) {
                console.log("calibrated", ts);
            }.bind(this));

            // "motionstart" events are fired when the "calibrated"
            // proximal area is disrupted, generally by some form of movement
            this.sensor.on("motionstart", function (err, ts) {
                console.log("motionstart", ts);
            }.bind(this));

            // "motionstart" events are fired following a "motionstart event
            // when no movement has occurred in X ms
            this.sensor.on("motionend", function (err, ts) {
                console.log("motionend", ts);
            }.bind(this));
        }
    });
});