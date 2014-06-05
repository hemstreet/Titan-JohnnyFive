/**
 * Implementation of johnny-five into the altair world, This module is mostly for demonstration and lookup purposes.
 * For more information check out johnny-five at https://github.com/rwaldron/johnny-five
 *
 * @author:     Jon Hemstreet
 * @license:    **Your license here**
 * @vendor:     titan
 * @module:     JohnnyFive
 * @nexus:      this.nexus("titan:JohnnyFive")
 *
 */

define(['altair/facades/declare', //take a look at terms.md
        'altair/facades/hitch',
        'altair/Lifecycle',
        'altair/events/Emitter',
        'altair/plugins/node!fs',
        'altair/plugins/node!johnny-five',
        'altair/modules/commandcentral/mixins/_HasCommandersMixin'
], function (declare,
             hitch,
             Lifecycle,
             Emitter,
             fs,
             five,
             _HasCommandersMixin) {

    return declare([Lifecycle, _HasCommandersMixin], {


        /**
         * @param options
         * @returns {altair.Promise}
         */
        startup: function (options) {

            //use the options that were passed in, or the ones we have by default; avoid mutating options
            var _options = options || this.options;

            // Disable repl or this will crash node :(
            this.board = new five.Board({
                repl: false
            });

            // Create a deferred so we can make sure that the board is fully initialized before we start our commander
            this.deferred = new this.Deferred;

            this.board.on("ready", function() {
                if(this.deferred) {
                    this.deferred.resolve(this);

                    // Due to IDE software crashes I have pin 13 strobe an led to ensure it is still connected
                    (new five.Led(13)).strobe();
                }
            }.bind(this));

            return this.inherited(arguments);
        }

    });
});