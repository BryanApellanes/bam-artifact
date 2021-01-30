var { expect } = require("chai");

describe("bam artifact", function () {

    it("should get git commit from bam-artifact", function(done) {
        var bamArtifact = require('../artifact');
        bamArtifact.gitCommitSha().then((val) => {
            console.log("COMMIT SHA:" + val);
            done();
        });
    })

    it("should get sha using await", async function(done) {
        var bamArtifact = require('../artifact');
        var sha = await bamArtifact.gitCommitSha();
        console.log('USING await: ' + sha);
        done();
    })

    it("should get baminputs", async function(done){
        var bamArtifact = require('../artifact');
        bamInput = bamArtifact.getBamInputs();
        expect(bamInput.bamCliArgsFromActionInputs).to.be.a('function');
        done();
    })

    it("should run", function(done){
        var bamArtifact = require('../artifact');
        bamArtifact.run(process.argv.slice(2));
    });

    it("should be able to require bam-inputs", function(done){
        var bamInputs = require('@bamapps/bam-inputs');
        expect(bamInputs).to.not.be.null;
        expect(bamInputs.bamCliArgsFromActionInputs).to.be.a('function');
        done();
    })
});
