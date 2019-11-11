const fs = require("fs");
const path = require("path");
const request = require("request");

module.exports = {
    randomColor: function(){
        var colorArr = [];
        for(var i = 0; i < 3; i++){
            var color = Math.floor(Math.random() * (255 - 0) + 0);
            colorArr.push(color);
        };
        return colorArr;
    },
    loadImageAssets: function(cb){
        console.log("reading assets folder");
        var that = this;
        fs.readFile("./assets", "utf8", function(err, data){
            if(err){
                console.log("error: ", err);
                if(cb){
                    cb(err);
                }
                return false;
            }
            data = data.split('\n');
            var data_json = JSON.parse('[' + data.join(',').slice(0, -1) + ']'),
                deleted_images = data_json.reduce(function(filtered, data_img){
                    if(data_img.deleted) {
                        var value = { name: data_img.name, newProperty: "deleted" }
                        filtered.push(data_img.uuid);
                    }
                    return filtered;
                }, []),
                img_urls = [];
                
            for (var i = 0, j = data.length; i < j; i++){
                if (data[i].length){
                    var img_data = JSON.parse(data[i]),
                        img_url = img_data.url;

                    if(image_url && deleted_images.indexOf(img_data.uuid) === -1 && that.extensionCheck(image_url)){
                        var file_name = that.getFilenameFromUrl.split('%2F')[1];
                        img_urls.push(image_url);
                    }
                }
            }
            if(cb){
                cb(null, img_urls);
            }
        });
    },
    loadRemoteImage: function(img_url, cb){
        if(!img_url){
            console.log('missing remote image URL');
            return false;
        }
        console.log(`loading remote image: ${img_url} ...`);
        request({url: img_url, encoding: null}, function(err, res, body){
            if(!err && res.statusCode == 200) {
                var b64content = 'data:' + res.headers['content-type'] + ';base64,';
                if(cb){
                    cb(null, body.toString('base64'));
                }else{
                    console.log('error; ', err);
                    if(cb){
                        cb(err);
                    }
                }
            }
        });
    },
    extensionCheck: function(url) {
        var file_extension = path.extname(url).toLowerCase(),
            extensions = ['.png', '.jpg', '.jpeg', '.gif'];
        return extensions.indexOf(file_extension) !== -1;
    },
    getFilenameFromUrl: function(url) {
        return url.substring(url.lastIndexOf('/') + 1);
    }
};