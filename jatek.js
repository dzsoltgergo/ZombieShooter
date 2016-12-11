var canvas = document.getElementById('canvas');

var ctx = canvas.getContext('2d');

var scene = new fw.Scene();
scene.add(new Hos(0,0));

fw.load([hosImg, zombiImg], function() {
    setInterval(function() {
        frame()
        render()
    }, 16)
})

function render() {
    canvas.width = canvas.width;
    scene.fire('draw', ctx);
}
function frame() {
    scene.index = fw.createIndex(scene)
    for(var i in fw.pressedKeys){
        scene.fire('keyDown_' + i);
    }
    scene.fire('frame');

}