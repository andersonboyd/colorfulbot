module.exports = {
    randomColor: function(){
        var colorArr = [];
        for(var i = 0; i < 3, i++;){
            var color = Math.floor(Math.random() * (255 - 0) + 0);
            colorArr.push(color);
        };
        return colorArr;
    }
};