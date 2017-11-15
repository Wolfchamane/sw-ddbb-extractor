const fs = require('fs');
const path = require('path');
const del = require('del');
const SWDDBBExtractor = require('./src/extractor');

let extractor = new SWDDBBExtractor();

extractor.on('complete', () =>
{
    let files = fs.readdirSync(path.resolve(__dirname, './output'));
    if (Array.isArray(files))
    {
        let ddbbContent = {};
        files.forEach(file =>
        {
            let filePath = path.resolve(__dirname, `./output/${file}`);
            let fileName = file.replace(/\..+$/, '');
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile())
            {
                ddbbContent[fileName] = JSON.parse(fs.readFileSync(filePath).toString());
            }
        });
        extractor._writer('ddbb', ddbbContent);
    }
    process.exit(0);
});

del([path.resolve(__dirname, './output/*.json')]).then(paths =>
{
    /*eslint no-console: 0*/
    console.log('Deleted %s files', paths.length);
    extractor.fetchFilms();
});
