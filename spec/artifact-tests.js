var { expect } = require("chai");

describe("bam inputs", function () {

    it("should get git commit", function(done){
        const {spawn} = require('child_process');
        const git = spawn('git', ['rev-parse', '--short', 'HEAD']);
        git.stdout.on('data', (data) => {
            console.log('HERE ' + data.toString());
        })
        git.stderr.on('data', (data) => {
            console.log(data.toString());
        })
        git.on('exit', (code) =>{
            console.log(`existed with code ${code}`);
            done();
        })
    })

    it("should get git commit from bam-artifact", function(done) {
        var bamArtifact = require('../artifact');
        bamArtifact.gitCommitSha().then((val) => {
            console.log("COMMIT SHA:" + val);
            done();
        });
    })
});
