var canvas = document.getElementById('canvas');

var ctx = canvas.getContext('2d');

var scene = new fw.Scene();
        scene.add(new CreateEnemy(0, 0), new Hos(100,100));

fw.load([zombiImg, hosImg], function() {
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