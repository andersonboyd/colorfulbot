require("dotenv").config();
const express = require("express");
const helper = require("./helper");
const axios = require("axios");
const twitter = require("./twitter");
const app = express();

app.use(express.static("public"));

app.all(`/${process.env.BOT_ENDPOINT}`, function(req, res){
    var colorId = helper.randomColor();
    var id = colorId.toString();
    axios.get(`http://thecolorapi.com/id?rgb=${id}&format=HTML`)
    .then(function(response){
        var search = response.data;
        console.log(search);
        var name = search.name.value;
        var img = search.image.bare;
        twitter.postColor(name, img, function(err){
            if(err){
                console.log(err);
                res.status(500).send();
            }else{
                res.status(200).send();
            }
        });
    }).catch(function(err){
        console.log(err.stack);
    });
    // var name = data.name.value;
    // var img = data.img.bare;
    // console.log(name);
    // console.log(img);

});

var listener = app.listen(process.env.PORT, function(){
    console.log('your bot is running on port ' + listener.address().port);
});
  