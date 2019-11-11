require("dotenv").config();
const fs = require("fs");
const express = require("express");
const helper = require("./helper");
const axios = require("axios");
const cheerio = require("cheerio");
const svg2png = require("svg2png");
const twitter = require("./twitter");

const app = express();

app.use(express.static("public"));

app.all(`/${process.env.BOT_ENDPOINT}`, function(req, res){
    var colorId = helper.randomColor();
    var id = colorId.toString();
    axios.get(`http://thecolorapi.com/id?rgb=${id}&format=JSON`)
    .then(function(response){
        var search = response.data;
        console.log(search);
        var name = search.name.value;
        var img = search.image.bare;
        var $ = cheerio.load(img);
        var svg = $("svg").children();
        console.log(svg);
        svg2png(svg, {width: 360, height: 360})
            .then(function(buffer){
                fs.writeFile(`/assets/${name}.png`, buffer);
                helper.loadImageAssets(function(err, asset_urls){
                    if(err){
                        console.log(err);
                        res.sendStatus(500);
                    }
                    else{
                        helper.loadRemoteImage(asset_urls.indexOf(asset_urls.length - 1), function(err, img_data){
                            if (err) {
                                console.log(err);
                                res.sendStatus(500);
                            }
                            else{
                                twitter.postColor(name, img_data, function(err, data){
                                    if(err){
                                        console.log(err);
                                        res.sendStatus(500);
                                    }else{
                                        console.log(data);
                                        res.sendStatus(200);
                                    }
                                });
                            }
                        })
                    }
                })
            .catch(function(err){
                console.error(err);
            });
        }).catch(function(err){
            console.error(err);
        });
    }).catch(function(err){
        console.log(err.stack);
    });
});

var listener = app.listen(process.env.PORT, function(){
    console.log('your bot is running on port ' + listener.address().port);
});
  