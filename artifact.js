const { resolve } = require('path');

var bamArtifact = (function () {
    var bamInputs = require('@bamapps/bam-inputs'),
        bamFs = require('@bamapps/bamfs'),
        _ = require('underscore'),
        actionsCore = require('@actions/core'),
        actionsArtifact = require('@actions/artifact'),
        github = require('@actions/github')
        defaultValues = {
            namePrefix: "BamArtifact",
            path: "/opt/bam/artifacts"
        };

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
        tryRequire: function(name){
            try{
                return require(name);
            }catch(ex){
                return null;
            }
        },
        getDependency: function(name){
            if(dependencies[name]){
                return dependencies[name];
            }
            var required = this.tryRequire(name);
            if(required){
                return required;
            }
        },
        injectDependency: function(name, obj){
            dependencies[name] = obj;
        },
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
        exec: function(command, argsArray){
            var _the = this;
            return new Promise((resolve, reject) => {
                _the.startProcess({
                    command: command,
                    args: argsArray,
                    onStdOut: function(data) {
                        resolve(data);
                    },
                    onStdErr: function(data) {
                        reject(data);
                    }
                });              
            });
        },
        gitCommitSha: async function(){
            return await this.exec("git", ["rev-parse", "--short", "HEAD"]);
        },
        getBamInputs: function(){
                return dependencies.bamInputs;
        },
        run: async function (scriptArgs) {           
            var _this = this;
            var bamArgs = dependencies.bamInputs;
            var bamActions = dependencies.actionsCore;
            bamActions.info(JSON.stringify(bamArgs));
            var actionInputs = bamArgs.bamCliArgsFromActionInputs(defaultValues);
            var requiredInputsNotProvided = false;
            if (!hasValue(actionInputs.path)) {
                bamActions.setFailed('Failed to get "path"');
                requiredInputsNotProvided = true;
            }
            if (!hasValue(actionInputs.namePrefix)) {
                bamActions.setFailed('Failed to get "name"');
                requiredInputsNotProvided = true;
            }
            if(requiredInputsNotProvided){
                return;
            }
            const artifactClient = actionsArtifact.create();
            const artifactName = `${namePrefix}-${await _this.gitCommitSha()}`;
            const files = bamFs.getAllFiles(actionInputs.path);
            const rootDirectory = actionInputs.path;
            const options = {
                conntinueOnError: true
            }
            const uploadResult = await artifactClient.uploadArtifact(artifactName, files, rootDirectory, options);
            bamActions.info(`bam-artifact upload result: ${JSON.stringify(uploadResult)}`);
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