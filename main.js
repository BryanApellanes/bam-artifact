var bamArtifact;
if (typeof require !== 'undefined' && require.main === module) {
    const { exec } = require('child_process');
    console.log(`current directory is ${process.cwd()}`)
    exec("npm install", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        bamArtifact = require('./artifact');
        bamArtifact.run(process.argv.slice(2));
    });    
}

module.exports = bamArtifact;

