const recursiceReaddir = require('recursive-readdir');
const mmm = require('mmmagic');
const magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);
const mimeTypes = require('mime-types');
const replaceExt = require('replace-ext');
const fs = require('fs');

module.exports = (dirPath) => {
    recursiceReaddir(dirPath, (err, files) => {
        if (err) {
            console.log("Error occured during reading files at provided path. Check your dirPath: " + dirPath);
            return;
        }
        
        files.forEach(file => {
            magic.detectFile(file, (err, mimeType) => {
                if (err) {
                    console.log("Failed to get mimetype for file: " + file);
                    return;
                }
                
                const extension = mimeTypes.extension(mimeType);
                
                if (!extension) {
                    console.log("Failed to retrieve extension for mimetype: " + mimeType + " file: " + file);
                    return;
                }
            
                const renamedFile = replaceExt(file, "." + extension);
                fs.rename(file, renamedFile, (err) => {
                    if (err) {
                        console.log("Failed to rename file from " + file + " to " + renamedFile);
                    }
                });
            });
        });
    });
};