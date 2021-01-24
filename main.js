if (typeof require !== 'undefined' && require.main === module) {
    require('./artifact').run(process.argv.slice(2));
}

