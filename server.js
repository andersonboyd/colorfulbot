require("dotenv").config();
const express = require("express");
const helper = require("./helper");
const twitter = require("./twitter");
const app = express();

app.use(express.static("public"));

app.all(`/${process.env.BOT_ENDPOINT}`, function(req, res){
    var id = helper.randomColor().split(",").toString().join(",");
    var data = helper.getColor(app, id);
    var name = data.name.value;
    var img = data.img.bare;
    twitter.postColor(name, img, function(err, cb){
        if(err){
            console.log(err);
            cb(err);
            res.status(500).send();
        }else{
            cb(null);
            res.status(200).send();
        }
    })
});

var listener = app.listen(process.env.PORT, function(){
    console.log('your bot is running on port ' + listener.address().port);
});
  