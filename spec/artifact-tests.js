var { expect } = require("chai");

describe("bam inputs", function () {

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
});
