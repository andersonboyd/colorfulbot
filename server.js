require("dotenv").config();
const express = require("express");
const helper = require("./helper.js");
const twitter = require("./twitter.js");
const app = express();

app.use(express.static("public"));

app.all(`/${process.env.BOT_ENDPOINT}`, function(req, res){
    var colorId = helper.randomColor().toString().join(",");
    var name;
    var img;
    console.log(colorId);
    app.get("https://thecolorapi.com/id?rgb=" + colorId +"&format=JSON", function(err, data){
        if (err) throw err;
        console.log(data);
        name = data.name.value;
        img = data.image.bare;
    }).then(function(err, response){
        twitter.postColor(name, img, function(err, data){
            if(err){
                console.log(err);
                res.status(500).send();
            }else{
                res.status(200).send();
            }
        })
    });
});

var listener = app.listen(process.env.PORT, function(){
    console.log('your bot is running on port ' + listener.address().port);
});
  