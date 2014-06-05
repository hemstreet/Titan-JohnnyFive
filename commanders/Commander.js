define(['altair/facades/declare',
    'altair/modules/commandcentral/mixins/_IsCommanderMixin',
    'altair/plugins/node!johnny-five'
], function (declare,
             _IsCommanderMixin,
             five) {

    return declare([_IsCommanderMixin], {

        pulse: function(options) {

            options.board = this.parent.board;
            this.ping = new five.Ping(options);
            this.ping.on('data', function(median) {
                console.log(this.ping.inches, median);
            }.bind(this));
        },
        servo: function(options) {
            options.board = this.parent.board;
            this._servo = new five.Servo(options);
//             this._servo.sweep();
            this._servo.center();
            this._servo.to( 90 );
        },
        motor: function(options) {
            options.board = this.parent.board;
            this._motor = new five.Motor(options);

            this._motor.start();

        }
    });
});