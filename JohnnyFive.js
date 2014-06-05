/**
 * Implementation of johnny-five into the altair world, This module is mostly for demonstration and lookup purposes.
 * Use the j5 commander to test the
 *
 * @author:     Jon Hemstreet
 * @license:    **Your license here**
 * @vendor:     titan
 * @module:     JohnnyFive
 * @nexus:      this.nexus("titan:JohnnyFive")
 *
 * What next?
 *
 * 1. Setting up listeners: altair.io/docs/listeners.md
 * 2. Using extensions: altair.io/docs/extensions.md
 * 3. Building a Commander: altair.io/core/vendors/altair/modules/commandcentral/README.md
 * 4. The Adapter Pattern:  altair.io/core/vendors/altair/modules/adapters/README.md
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
         * Startup is called after every module is instantiated, but you still can only rely on module's existing that
         * you have specified in your package.json as altairDependencies.
         *
         * @param options
         * @returns {altair.Promise}
         */
        startup: function (options) {

            //use the options that were passed in, or the ones we have by default; avoid mutating options
            var _options = options || this.options;

            this.board = new five.Board({
                repl: false
            });

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