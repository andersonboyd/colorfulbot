const config = {
    twitter: {
        username: process.env.USERNAME,
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.SECRET_CONSUMER_KEY,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.SECRET_ACCESS_TOKEN
        }
    },
    Twit = require('twit'),
    T = new Twit(config.twitter);

module.exports = {
    postColor: function(text, image_base64, cb){
        T.post("media/upload", {media_data: image_base64}, function(err, data, response){
            if(err){
                console.log("ERROR:\n", err);
                if(cb){
                    cb(err);
                }
            }
            else{
                console.log("tweeting color");
                T.post("statuses/update", {
                    status: text,
                    media_ids: new Array(data.media_id_string)
                }, function(err, data, response){
                    if(err){
                        console.log("ERROR:\n", err);
                        if(cb){
                            cb(err);
                        }
                    }else{
                        console.log("tweet success");
                        if(cb){
                            cb(null);
                        }
                    }
                });
            }
        });
    }
};
