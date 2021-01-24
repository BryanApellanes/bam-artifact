var bamArtifact = (function () {
    var bamInputs = require('@bamapps/bam-inputs'),
        _ = require('underscore'),
        actionsCore = require('@actions/core'),
        actionsArtifact = require('@actions/artifact'),
        github = require('@actions/github');

    var dependencies = {
        bamInputs: bamInputs,
        actionsCore: actionsCore,
        actionsArtifact: actionsArtifact,
        github: github
    }

    function hasValue(o){
        return o !== null && o !== undefined && o !== '';
    }

    return {
        bamArgs: dependencies.args,
        scriptInfo: dependencies.scriptInfo,
        github: dependencies.github,
        startProcess: function(options) {
            var opts = _.extend({}, {command: '', args: [], onStdOut: function(){}, onStdErr: function(){}, onExit: function(){}}, options);
            const { spawn } = require('child_process');
            const childProcess = spawn(opts.command, opts.args);
            childProcess.stdout.on('data', (data) => {
                opts.onStdOut(data);
            })
            childProcess.stderr.on('data', (data) => {
                opts.onStdErr(data);
            })
            childProcess.on('exit', (code) => {
                opts.onExit(code);
            })
        },
        gitCommitSha: function(){
            var _the = this,
                sha = '';
            return new Promise((resolve, reject) => {
                _the.startProcess({
                    command: 'git',
                    args: ["rev-parse", "--short", "HEAD"],
                    onStdOut: function(data) {
                        sha = data.toString();
                        resolve(sha);
                    },
                    onStdErr: function(data) {
                        reject(data);
                    }
                });
            })
        },
        run: function (scriptArgs) {
            var bi = dependencies.bamInputs;
            var args = bi.bamCliArgsFromActionInputs({namePrefix: null, path: null});
            if(!hasValue(args.path)){
                actionsCore.setFailed('Failed to get "path"');
            }
            if(!hasValue(args.namePrefix)){
                actionsCore.setFailed('Failed to get "name"');
            }
            const artifactClient = actionsArtifact.create();
            //const artifactName = 
        },
        inject: function (obj) {
            dependencies = _.extend({}, dependencies, obj);
        }
    }
})()

if (typeof require !== 'undefined' && require.main === module) {
    bamArtifact.run(process.argv.slice(2));
}

module.exports = bamArtifact;