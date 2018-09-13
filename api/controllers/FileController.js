/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var sid = require('shortid');
var path = require('path');
var mkdirp = require('mkdirp');

var UPLOAD_PATH = 'public/images';

module.exports = {
    uploadFile: function(request, response) {
    
        try {
            mkdirp.sync(UPLOAD_PATH, 0755);
        } catch (e) {
            console.log(e);
        }

        request.file('file').upload({ 
            dirname: path.resolve(sails.config.appPath, UPLOAD_PATH) 
        },function(error, absoluteFile) {

            var fileDescriptor = absoluteFile[0].fd;
            var filename = fileDescriptor.replace(/^.*[\\\/]/, '')

            if (error) return response.json(503, {
                message: error
            });

            if (absoluteFile.length === 0) return response.json(404, {
                message: 'not file to uploaded'
            });

            File.create({
                filename: filename
            }, function(error, result) {
                if (error) return response.json(503, {
                    message: error
                });

                return response.json(200, {
                    message: result
                });
            });

        });
    },

    getFile: function (request, response) {
        response.sendfile(request.path.substr(1), function(error, result) {
            if (error) {
                return response.json(404, {
                    message: 'file not found'
                });
            }
        });
    }
};