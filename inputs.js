var bamInputs = (function () {
    var cliArgs = require('@bamapps/bam-cli-args'),
        _ = require('underscore'),
        actionsCore = require('@actions/core');

    var dependencies = {
        cliArgs: cliArgs,
        actionsCore: actionsCore
    }

    return {
        inject: function(obj){
            dependencies = _.extend({}, dependencies, obj);
        },
        bamArgs: cliArgs.args,
        scriptInfo: cliArgs.scriptInfo,
        bamArgsFromActionInputs: function(obj) {
            var ac = dependencies.actionsCore;
            var result = {};
            if(obj !== undefined && obj !== null){
                for(var prop in obj){
                    result[prop] = ac.getInput(prop);
                }
            }
            return result;
        },
        bamCliArgsFromActionInputs: function(obj) {
            return this.toBamCliArgs(this.bamArgsFromActionInputs(obj));
        },
        /**
         * Gets a BamArgs object from the environment.  If an object is specified
         * that objects properties are set from environment variables.  If no 
         * object is specified environment variables prefixed with 'bam-' are returned
         * as the properties of the resulting object.
         * @param {*} obj 
         */
        bamCliArgsFromEnv: function(obj){
            var result = {};
            if(obj !== undefined && obj !== null){
                for (var prop in obj) {
                    if(process.env[prop]) {
                        result[prop] = process.env[prop];
                    }
                    if(process.env[`bam-${prop}`]){
                        result[prop] = process.env[`bam-${prop}`];
                    }
                }
            }
            else {
                for(var prop in process.env){
                    if(prop.startsWith('bam-')) {
                        result[prop.substr('bam-'.length)] = process.emv[prop];
                    }
                }
            }
            return result;
        },
        toBamCliArgs: function(obj) {
            var result = '';
            for(var prop in obj){
                var key = `/${prop}`,
                    val = obj[prop] === null ? '': obj[prop];
                
                result += key;
                if (val !== '' ) {
                    if (val.includes(' ')){
                        result += `:"${val}"`;
                    } else {
                        result += `:${val}`;
                    }
                }
                result += ' ';
            }
            return result.trim();
        },
        fromBamCliArgs: function(argsString){
            var split = argsString.split(' ');
            var result = {};
            for(var i = 0; i < split.length; i++){
                var arg = split[i];
                if(arg.startsWith("/")){
                    var keyValPair = arg.split(":");
                    var key = keyValPair[0].substr(1);
                    var value = '';
                    if (keyValPair.length == 2) {
                        value = keyValPair[1];
                    }
                    result[key] = value;
                }
            }
            return result;
        },
        run: function (scriptArgs) {
            console.log(cliArgs.scriptInfo());
        }
    }
})()

if (typeof require !== 'undefined' && require.main === module) {
    bamInputs.run(process.argv.slice(2));
}

module.exports = bamInputs;