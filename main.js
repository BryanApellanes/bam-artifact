var bamArtifact = require('./artifact');

if (typeof require !== 'undefined' && require.main === module) {
    bamArtifact.run(process.argv.slice(2));
}

module.exports = bamArtifact;

