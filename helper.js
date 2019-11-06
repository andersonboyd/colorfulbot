module.exports = {
    randomColor: function(){
        var colorArr = [];
        for(var i = 0; i < 3, i++;){
            var color = Math.floor(Math.random() * (255 - 0) + 0);
            colorArr.push(color);
        };
        return colorArr;
    },
    getColor: function(app, id){
        app.get(`https://thecolorapi.com/id?rgb=${id}&format=JSON`, function(err, data){
            if (err){
                console.log(err.stack);
                res.status(500).send();
            }else{
                console.log(data);
                res.status(200).json(data);
            }
        })
    }
};