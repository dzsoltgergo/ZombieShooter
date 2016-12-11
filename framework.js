(function () { //önmagát meghívó függvény: mivel nincs blokkszintű láthatóság, így tudunk egy scope-ot létrehozni, hogy ne a globális névtérbe szemeteljünk
    var fw = {};

    function register(clz){
        clz.prototype._events = {};
        var parent=clz.prototype.__proto__.constructor
        if (parent) {
            for (i in parent.prototype._events) {
                clz.prototype._events[i] = parent.prototype._events[i].slice(0);
            }
        }

        var methods=Object.getOwnPropertyNames(clz.prototype)
        for (var j=0;j!=methods.length;j++) {
            var i=methods[j]
            if (i[0] === '$') {
                var event = i.substring(1);
                if (!clz.prototype._events[event]) {
                    clz.prototype._events[event] = [];
                }
                clz.prototype._events[event].push(clz.prototype[i]);
            }
        }
    }

    fw.register=register


    class Entity1{
        constructor(x,y){
            this.x=x
            this.y=y
        }

        getLeft(){
            return this.x
        }

        getTop(){
            return this.y
        }

        getWidth(){
            return 0
        }

        getHeight(){
            return 0
        }

        fire (event, data) {
            var listeners = this._events[event];
            if (listeners) {
                for (var i = 0; i < listeners.length; i++) {
                    listeners[i].call(this, data);
                }
            }
        };
    }

    fw.Entity=Entity1

    fw.image = function (src) {
        var img = document.createElement('img');
        img.src = src;
        return img;
    };

    fw.load = function (images, onLoad, onProgress) {
        var loaded = 0;

        function checkLoaded() {
            if (onProgress) {
                onProgress(loaded / images.length * 100);
            }
            if (loaded === images.length) { //ha minden kép be volt töltve, akkor rögtön meghívjuk
                onLoad();
            }
        }

        for (var i = 0; i < images.length; i++) {
            if (images[i].width > 0) { //a kép be van töltve
                loaded++;
            } else { //eseménykezelőt rakunk a képre, ha nincs betöltve
                images[i].addEventListener('load', function () {
                    loaded++;
                    checkLoaded();
                });
            }
        }
        checkLoaded();
    };

    var pressedKeys = {}; //asszociatív tömbben tároljuk, hogy egy gomb le van-e nyomva, egyszerűbb, mint 4 külön változóban.
    document.onkeydown = function (e) {
        pressedKeys[e.which] = true;
    };

    document.onkeyup = function (e) {
        delete pressedKeys[e.which];
    };

    fw.pressedKeys = pressedKeys;

    fw.isDown = function (key) {
        return pressedKeys[key];
    };

    fw.entity = function (parent, methods) { // "osztály" készítése
        var i;
        if(!methods){ // 1 paraméter: a parent alatt találjuk a metódusokat
            methods = parent;
            parent = null;
        }

        var customInit = methods.init;

        function Entity(x, y) {
            this.x = x;
            this.y = y;
            this.init();
        }

        function Parent(){
        }

        if (parent) {
            Parent.prototype = parent.prototype;
        }

        Entity.prototype = new Parent();
        for (i in methods) {
            if(i[0]!=='$') {
                Entity.prototype[i] = methods[i];
            }
        }

        Entity.prototype.init = function () { // "konstruktor", amely meghívja az ős initjét és a saját initet
            if (parent) {
                parent.prototype.init.call(this);
            }
            if (customInit) {
                customInit.call(this);
            }
        };

        Entity.prototype._events = {};
        if (parent) {
            for (i in parent.prototype._events) {
                Entity.prototype._events[i] = parent.prototype._events[i].slice(0);
            }
        }
        for (i in methods) {
            if (i[0] === '$') {
                var event = i.substring(1);
                if (!Entity.prototype._events[event]) {
                    Entity.prototype._events[event] = [];
                }
                Entity.prototype._events[event].push(methods[i]);
            }
        }

        Entity.prototype.fire = function (event, data) {
            var listeners = this._events[event];
            if (listeners) {
                for (var i = 0; i < listeners.length; i++) {
                    listeners[i].call(this, data);
                }
            }
        };

        return Entity;
    };

    /**
     * -parent prototype
     * -methods
     *
     */

    function createMask(img) { //közvetlenül az img objektumból nem kérhető le a pixel, ezért egy láthatatlan canvasra rajzoljuk, és azt használjuk erre.
        var canvas = document.createElement('canvas'); //off-screen canvas!
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0); //canvasra rajzoljuk a képet

        var data = ctx.getImageData(0, 0, img.width, img.height).data; //nem működik file:// protokollal!

        //a data egy sima tömb, sorban jönnek a pixelek adatai
        //egy pixel adata 4 elemet foglal el: R,G,B,A

        img.isTransparent = function (x, y) {
            return data[(y * img.width + x) * 4 + 3] === 0; //a pixelhez tartozó áttetszőségi érték == 0?
        };
    }

    fw.rectIntersect = function (x1, y1, w1, h1, x2, y2, w2, h2) { //egyszerű metszés vizsgálat
        return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
    };

    function ensureHasMask(img) {
        if (!img.isTransparent) { //nincs isTransparent metódusa - még nem tartozik hozzá maszk!
            createMask(img);
        }
    }

    fw.maskIntersect = function (mask1, x1, y1, mask2, x2, y2) { //két maszk közti metszés vizsgálat
        if (fw.rectIntersect(x1, y1, mask1.width, mask1.height, x2, y2, mask2.width, mask2.height)) {
            ensureHasMask(mask1);
            ensureHasMask(mask2);

            var left = Math.max(x1, x2);
            var top = Math.max(y1, y2);
            var right = Math.min(x1 + mask1.width, x2 + mask2.width);
            var bottom = Math.min(y1 + mask1.height, y2 + mask2.height);
            for (var i = left; i < right; i++) {
                for (var j = top; j < bottom; j++) {
                    if (!mask1.isTransparent(i - x1, j - y1) && !mask2.isTransparent(i - x2, j - y2)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    function key(x, y) {
        return x + ',' + y;
    }

    fw.createIndex = function (scene, size) { //bin index készítés
        if (!size) {
            size = 64;
        }
        var grid = {};
        scene.forEach(function(entity){
            if (!entity.getLeft) { //ha nincs mérete, nem rakjuk bele az indexbe.
                return;
            }
            //entitás szélének meghatározása (cella szélek)
            var left = entity.getLeft();
            var top = entity.getTop();
            var cellLeft = Math.floor(left / size);
            var cellTop = Math.floor(top / size);
            var cellRight = Math.floor((left + entity.getWidth()) / size);
            var cellBottom = Math.floor((top + entity.getHeight()) / size);

            //végig megyünk az összes cellán, amit érint az entitás
            for (var x = cellLeft; x <= cellRight; x++) {
                for (var y = cellTop; y <= cellBottom; y++) {
                    var cellKey = key(x, y);
                    var cellData = grid[cellKey]; //az adott koordinátához tartozó cella infó lekérése
                    if (!cellData) { //a cella üres volt
                        grid[cellKey] = [entity]; //a cella mostantól egy elemet tartalmaz: az entitást
                    } else {
                        cellData.push(entity); //a cellához hozzáadunk még egy elemet
                    }
                }
            }
        });

        return {
            query: function (left, top, width, height) {
                var cellLeft = Math.floor(left / size);
                var cellTop = Math.floor(top / size);
                var cellRight = Math.floor((left + width) / size);
                var cellBottom = Math.floor((top + height) / size);

                var result = [];
                for (var x = cellLeft; x <= cellRight; x++) {
                    for (var y = cellTop; y <= cellBottom; y++) {
                        var cellKey = key(x, y);
                        var cellData = grid[cellKey]; //az adott koordinátához tartozó cella infó lekérése
                        if (!cellData) { //a cellában nincs elem
                            continue;
                        }
                        for (var j = 0; j < cellData.length; j++) { //a cella minden elemét belerakjuk, ha még nem volt benne
                            var entity = cellData[j];
                            if (result.indexOf(entity) !== -1) { //már benne van az eredmény tömbben
                                continue;
                            }
                            if (!fw.rectIntersect(left, top, width, height, entity.getLeft(), entity.getTop(), entity.getWidth(), entity.getHeight())) {
                                continue; //ha ugyan a cella stimmel, de mégsem metszik egymást
                            }
                            result.push(entity);
                        }
                    }
                }
                return result;
            },
            hasCollision: function (entity, tipus, xShift, yShift) {
                xShift = xShift || 0;
                yShift = yShift || 0;
                var utkozesek = this.query(entity.getLeft() + xShift, entity.getTop() + yShift, entity.getWidth(), entity.getHeight());
                for (var i = 0; i < utkozesek.length; i++) {
                    if (utkozesek[i] instanceof tipus && utkozesek[i] !== entity) {
                        return true;
                    }
                }
                return false;
            }
        };
    };

    fw.EntityWithSprite = fw.entity({
        init: function () {
            this.image = null;
            this.imageRows = 1;
            this.imageColumns = 1;
            this.imageRow = 0;
            this.imageColumn = 0;
            this.imageScaleX = 1;
            this.imageScaleY = 1;
        },
        $draw: function (ctx) {
            if (!this.image) {
                return;
            }
            ctx.drawImage(this.image, this.getSourceLeft(), this.getSourceTop(), this.getSourceWidth(), this.getSourceHeight(), this.getTargetLeft(), this.getTargetTop(), this.getTargetWidth(), this.getTargetHeight()); //felrajzoljuk a hőst
        },
        getLeft: function () {
            return this.getTargetLeft();
        },
        getTop: function () {
            return this.getTargetTop();
        },
        getWidth: function () {
            return this.getTargetWidth();
        },
        getHeight: function () {
            return this.getTargetHeight();
        },
        getSourceLeft: function () {
            return this.image.width / this.imageColumns * this.imageColumn;
        },
        getSourceTop: function () {
            return this.image.height / this.imageRows * this.imageRow;
        },
        getSourceWidth: function () {
            return this.image.width / this.imageColumns;
        },
        getSourceHeight: function () {
            return this.image.height / this.imageRows;
        },
        getTargetLeft: function () {
            return this.x;
        },
        getTargetTop: function () {
            return this.y;
        },
        getTargetWidth: function () {
            if (!this.image) {
                return 0;
            }
            return this.getSourceWidth() * this.imageScaleX;
        },
        getTargetHeight: function () {
            if (!this.image) {
                return 0;
            }
            return this.getSourceHeight() * this.imageScaleY;
        }
    });

    fw.Scene = function () {
        this._nextId=0;
        this._entities = {};
        this._entitiesByEvent = {};
    };

    fw.Scene.prototype = {
        add:function(){
            for(var i=0;i<arguments.length;i++){
                var entity = arguments[i];
                var id = this._nextId++;
                entity.id = id;
                entity.scene = this;
                this._entities[id] = entity;

                for (var event in entity._events) {
                    if (!this._entitiesByEvent[event]) {
                        this._entitiesByEvent[event] = {};
                    }
                    this._entitiesByEvent[event][id] = entity;
                }
            }
        },

        remove:function(entity){
            delete this._entities[entity.id];
            for (var event in entity._events) {
                delete this._entitiesByEvent[event][entity.id];
            }
        },

        forEach:function(callback){
            for(var i in this._entities){
                callback(this._entities[i]);
            }
        },

        fire: function (event, param) {
            var entitasok = this._entitiesByEvent[event];
            if (entitasok) {
                for (var id in entitasok) {
                    entitasok[id].fire(event, param);
                }
            }
        }
    };

    window.fw = fw; //egyetlen elemet rakunk a globális névtérbe
})();