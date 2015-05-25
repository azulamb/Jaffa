var Jaffa;
(function (Jaffa) {
    var System = (function () {
        function System() {
            this.nextgame = null;
            this.game = null;
            this.setFPS(30.0);
            this.input = null;
            this.isrun = false;
        }
        System.prototype.gameLoop = function () {
            if (this.nextgame != null) {
                if (this.game != null) {
                    this.game.CleanUp();
                }
                this.game = this.nextgame;
                this.game.UserInit();
                this.nextgame = null;
            }
            return this.game.MainLoop();
        };
        System.prototype.isRun = function () {
            return this.isrun;
        };
        System.prototype.setInput = function (input) {
            this.input = input;
            return true;
        };
        System.prototype.setFPS = function (fps) {
            this.fps = fps;
            return true;
        };
        System.prototype.run = function () {
            var _this = this;
            if (this.gameLoop() && this.isrun) {
                setTimeout(function () {
                    _this.run();
                }, 1000.0 / this.fps);
                if (this.input) {
                    this.input.renewal();
                }
                return true;
            }
            return false;
        };
        System.prototype.start = function () {
            if (this.isrun == false) {
                this.isrun = true;
                this.run();
            }
            return true;
        };
        System.prototype.stop = function () {
            this.isrun = false;
            return false;
        };
        System.prototype.setNewGame = function (game) {
            this.nextgame = game;
            return true;
        };
        System.getBrowser = function () {
            var userAgent = window.navigator.userAgent.toLowerCase();
            if (userAgent.indexOf('msie') != -1) {
                var appVersion = window.navigator.appVersion.toLowerCase();
                if (appVersion.indexOf('msie 6.') != -1) {
                    return 'ie 6';
                }
                else if (appVersion.indexOf('msie 7.') != -1) {
                    return 'ie 7';
                }
                else if (appVersion.indexOf('msie 8.') != -1) {
                    return 'ie 8';
                }
                else if (appVersion.indexOf('msie 9.') != -1) {
                    return 'ie 9';
                }
                else if (appVersion.indexOf('msie 10.') != -1) {
                    return 'ie 10';
                }
                else if (appVersion.indexOf('msie 11.') != -1) {
                    return 'ie 11';
                }
                return 'ie 0';
            }
            else if (userAgent.indexOf('chrome') != -1) {
                return 'chrome';
            }
            else if (userAgent.indexOf('gecko') != -1) {
                return 'gecko';
            }
            else if (userAgent.indexOf('opera') != -1) {
                return 'opera';
            }
            else if (userAgent.indexOf('safari') != -1) {
                return 'safari';
            }
            else if (userAgent.indexOf('android') != -1) {
                if (userAgent.indexOf('Mobile') == -1) {
                    return 'android mobile';
                }
                return 'android tablet';
            }
            else if (userAgent.indexOf('ipad') != -1) {
                return 'ipad';
            }
            else if (userAgent.indexOf('ipod') != -1) {
                return 'ipod';
            }
            else if (userAgent.indexOf('iphone') != -1) {
                return 'iphone';
            }
            else if (userAgent.indexOf('mobile') != -1) {
                return 'mobile';
            }
            return 'none';
        };
        System.isiOS = function () {
            var userAgent = window.navigator.userAgent.toLowerCase();
            if (userAgent.indexOf('ipad') != -1 || userAgent.indexOf('ipod') != -1 || userAgent.indexOf('iphone') != -1) {
                return true;
            }
            return false;
        };
        return System;
    })();
    Jaffa.System = System;
    var Input = (function () {
        function Input() {
            this.keyframe = {};
            this.key = {};
            this.mx = -1;
            this.my = -1;
            this.clickframe = 0;
            this.click = false;
            this.mouseeventdown = null;
            this.mouseeventup = null;
            this.mouseeventmove = null;
            this.toucheventdown = null;
            this.toucheventup = null;
            this.toucheventmove = null;
            this.scrolltimer = 0;
            this.scrolltimeron = false;
        }
        Input.prototype.mouseUp = function (ev) {
            this.click = false;
            this.mouseEvent(ev);
            return false;
        };
        Input.prototype.mouseDown = function (ev) {
            this.click = true;
            this.mouseEvent(ev);
            return false;
        };
        Input.prototype.mouseEvent = function (ev) {
            if (ev.offsetX != undefined) {
                this.mx = ev.offsetX;
                this.my = ev.offsetY;
            }
            else {
                this.mx = ev.layerX;
                this.my = ev.layerY;
            }
            return false;
        };
        Input.prototype.touchUp = function (ev) {
            this.click = false;
            return false;
        };
        Input.prototype.touchDown = function (ev) {
            this.click = true;
            this.touchEvent(ev);
            return false;
        };
        Input.prototype.touchEvent = function (ev) {
            this.mx = ev.touches[0].clientX - this.cx;
            this.my = ev.touches[0].clientY - this.cy;
            return false;
        };
        Input.prototype.keyDown = function (ev) {
            this.key[ev.keyCode] = true;
            if (!(ev.keyCode in this.keyframe)) {
                this.keyframe[ev.keyCode] = 0;
            }
            this.keyEvent(ev);
            return true;
        };
        Input.prototype.keyUp = function (ev) {
            this.key[ev.keyCode] = false;
            if (this.keyframe[ev.keyCode] == undefined) {
                this.keyframe[ev.keyCode] = 0;
            }
            this.keyEvent(ev);
            return true;
        };
        Input.prototype.keyEvent = function (ev) {
            return true;
        };
        Input.prototype.renewal = function () {
            var key;
            if (this.click) {
                ++this.clickframe;
            }
            else if (this.clickframe > 0) {
                this.clickframe = -1;
            }
            else if (this.clickframe < 0) {
                this.clickframe = 0;
            }
            for (key in this.key) {
                if (this.key[key]) {
                    ++this.keyframe[key];
                }
                else if (this.keyframe[key] > 0) {
                    this.keyframe[key] = -1;
                }
                else if (this.keyframe[key] < 0) {
                    this.keyframe[key] = 0;
                }
            }
        };
        Input.prototype.removeTouchEvent = function (canvas) {
            if (canvas === void 0) { canvas = this.canvas; }
            if (this.toucheventdown) {
                canvas.removeEventListener("touchstart", this.toucheventdown, false);
            }
            if (this.toucheventmove) {
                canvas.removeEventListener("touchmove", this.toucheventmove, false);
            }
            if (this.toucheventup) {
                canvas.removeEventListener("touchend", this.toucheventup, false);
            }
            this.toucheventdown = null;
            this.toucheventmove = null;
            this.toucheventup = null;
            return true;
        };
        Input.prototype.addTouchEvent = function (canvas, mouseremove) {
            var _this = this;
            if (canvas === void 0) { canvas = this.canvas; }
            if (mouseremove === void 0) { mouseremove = true; }
            this.toucheventdown = function (ev) {
                _this.touchDown(ev);
            };
            this.toucheventmove = function (ev) {
                _this.touchEvent(ev);
            };
            this.toucheventup = function (ev) {
                _this.touchUp(ev);
            };
            canvas.addEventListener("touchstart", this.toucheventdown, false);
            canvas.addEventListener("touchmove", this.toucheventmove, false);
            canvas.addEventListener("touchend", this.toucheventup, false);
            return true;
        };
        Input.prototype.removeMouseEvent = function (canvas) {
            if (canvas === void 0) { canvas = this.canvas; }
            if (this.mouseeventdown != null) {
                canvas.removeEventListener("mousedown", this.mouseeventdown, false);
            }
            if (this.mouseeventmove != null) {
                canvas.removeEventListener("mousemove", this.mouseeventmove, false);
                canvas.removeEventListener("mouseover", this.mouseeventmove, false);
            }
            if (this.mouseeventup != null) {
                canvas.removeEventListener("mouseout", this.mouseeventup, false);
                canvas.removeEventListener("mouseup", this.mouseeventup, false);
            }
            this.mouseeventdown = null;
            this.mouseeventup = null;
            return true;
        };
        Input.prototype.addMouseEvent = function (canvas, touchremove) {
            var _this = this;
            if (canvas === void 0) { canvas = this.canvas; }
            if (touchremove === void 0) { touchremove = true; }
            this.mouseeventdown = function (ev) {
                _this.mouseDown(ev);
            };
            this.mouseeventmove = function (ev) {
                _this.mouseEvent(ev);
            };
            this.mouseeventup = function (ev) {
                _this.mouseUp(ev);
            };
            canvas.addEventListener("mousedown", this.mouseeventdown, false);
            canvas.addEventListener("mousemove", this.mouseeventmove, false);
            canvas.addEventListener("mouseover", this.mouseeventmove, false);
            canvas.addEventListener("mouseout", this.mouseeventup, false);
            canvas.addEventListener("mouseup", this.mouseeventup, false);
            return true;
        };
        Input.prototype.removeKeyEvent = function () {
            if (this.keyeventdown) {
                window.removeEventListener("keydown", this.keyeventdown, false);
            }
            else if (this.keyeventup) {
                window.removeEventListener("keyup", this.keyeventup, false);
            }
            this.keyeventdown = null;
            this.keyeventup = null;
            return true;
        };
        Input.prototype.addKeyEvent = function () {
            var _this = this;
            this.keyeventdown = function (ev) {
                _this.keyDown(ev);
            };
            this.keyeventup = function (ev) {
                _this.keyUp(ev);
            };
            window.addEventListener("keydown", this.keyeventdown, false);
            window.addEventListener("keyup", this.keyeventup, false);
            return true;
        };
        Input.canUseTouch = function () {
            return (('createTouch' in document) || ('ontouchstart' in document));
        };
        Input.prototype.resetCanvasPosition_ = function () {
            var html = document.documentElement;
            var body = document.body;
            var rect = this.canvas.getBoundingClientRect();
            this.cx = rect.left - html.clientLeft + (body.scrollLeft || html.scrollLeft);
            this.cy = rect.top - html.clientTop + (body.scrollTop || html.scrollTop);
            this.scrolltimeron = false;
            return true;
        };
        Input.prototype.resetCanvasPosition = function () {
            var _this = this;
            if (this.scrolltimeron) {
                clearTimeout(this.scrolltimer);
            }
            this.scrolltimeron = true;
            this.scrolltimer = setTimeout(function () {
                _this.resetCanvasPosition_();
            }, 100);
            return true;
        };
        Input.prototype.setCanvas = function (canvas) {
            var _this = this;
            this.canvas = canvas;
            if (Input.canUseTouch()) {
                this.addTouchEvent(canvas);
                this.addMouseEvent(canvas);
            }
            else {
                this.addMouseEvent(canvas);
            }
            this.addKeyEvent();
            this.resetCanvasPosition();
            window.addEventListener("scroll", function () {
                _this.resetCanvasPosition();
            }, false);
            return true;
        };
        Input.prototype.getX = function () {
            return this.mx;
        };
        Input.prototype.getY = function () {
            return this.my;
        };
        Input.prototype.getMouse = function () {
            return this.clickframe;
        };
        Input.prototype.getKeyNum = function (keynum) {
            if (this.keyframe[keynum]) {
                return this.keyframe[keynum];
            }
            return 0;
        };
        Input.K_LEFT = 37;
        Input.K_UP = 38;
        Input.K_RIGHT = 39;
        Input.K_DOWN = 40;
        Input.K_SPACE = 32;
        return Input;
    })();
    Jaffa.Input = Input;
    var Net = (function () {
        function Net() {
        }
        Net.prototype.httpCreate = function () {
            var httpobj = null;
            try {
                httpobj = new XMLHttpRequest();
            }
            catch (e) {
                try {
                    httpobj = new ActiveXObject("Msxml2.XMLHTTP");
                }
                catch (e) {
                    try {
                        httpobj = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    catch (e) {
                        return null;
                    }
                }
            }
            return httpobj;
        };
        Net.prototype.httpGet = function (address, senddata) {
            if (senddata === void 0) { senddata = null; }
            var httpobj = this.httpCreate();
            if (httpobj) {
                httpobj.open("GET", address, false);
                httpobj.send(senddata);
                return httpobj.responseText;
            }
            return "";
        };
        Net.prototype.httpGet_ = function (address, func) {
            if (func === void 0) { func = null; }
            var httpobj = this.httpCreate();
            if (httpobj) {
                if (func) {
                    httpobj.onreadystatechange = func;
                    httpobj.open("GET", address, true);
                    httpobj.send(null);
                    return "";
                }
                else {
                    httpobj.open("GET", address, false);
                    httpobj.send(null);
                    return httpobj.responseText;
                }
            }
            return "";
        };
        return Net;
    })();
    Jaffa.Net = Net;
    var FontData = (function () {
        function FontData() {
        }
        return FontData;
    })();
    var DrawCanvas = (function () {
        function DrawCanvas() {
            this.imgs = {};
            this.fonts = {};
            this.createFont(0);
        }
        DrawCanvas.prototype.getCanvas = function () {
            return this.canvas;
        };
        DrawCanvas.prototype.getImage = function (imgnum) {
            return this.imgs[imgnum];
        };
        DrawCanvas.prototype.setCanvas = function (value) {
            if (typeof (value) == "string") {
                this.canvas = document.getElementById(value);
            }
            else {
                this.canvas = value;
            }
            this.context = this.canvas.getContext("2d");
            this.enableDrawPixelMode();
            return true;
        };
        DrawCanvas.prototype.enableDrawPixelMode = function (enable) {
            if (enable === void 0) { enable = true; }
            enable = !enable;
            var ctx = this.context;
            if (ctx.imageSmoothingEnabled === undefined || System.isiOS()) {
                ctx.webkitImageSmoothingEnabled = enable;
            }
            ctx.imageSmoothingEnabled = enable;
            ctx.mozImageSmoothingEnabled = enable;
            ctx.msImageSmoothingEnabled = enable;
        };
        DrawCanvas.prototype.setCanvasScale = function (scale) {
            this.context.scale(scale, scale);
            return true;
        };
        DrawCanvas.prototype.loadImage = function (imgnum, img) {
            if (typeof (img) == "string") {
                this.imgs[imgnum] = new Image();
                this.imgs[imgnum].src = img;
            }
            else {
                this.imgs[imgnum] = img;
            }
            return true;
        };
        DrawCanvas.prototype.clearScreen = function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return true;
        };
        DrawCanvas.prototype.drawBox = function (dx, dy, w, h, color) {
            this.context.fillStyle = color;
            this.context.fillRect(dx, dy, w, h);
            return true;
        };
        DrawCanvas.prototype.drawImage = function (imgnum, x, y, w, h, dx, dy) {
            if (w === void 0) { w = undefined; }
            if (h === void 0) { h = undefined; }
            if (dx === void 0) { dx = undefined; }
            if (dy === void 0) { dy = undefined; }
            if (w === undefined) {
                this.context.drawImage(this.imgs[imgnum], 0, 0, this.imgs[imgnum].width, this.imgs[imgnum].height, Math.floor(x), Math.floor(y), this.imgs[imgnum].width, this.imgs[imgnum].height);
            }
            else {
                this.context.drawImage(this.imgs[imgnum], x, y, w, h, Math.floor(dx), Math.floor(dy), w, h);
            }
            return true;
        };
        DrawCanvas.prototype.drawImageC = function (imgnum, rx, ry, w, h, dx, dy) {
            if (w === void 0) { w = undefined; }
            if (h === void 0) { h = undefined; }
            if (dx === void 0) { dx = undefined; }
            if (dy === void 0) { dy = undefined; }
            if (w === undefined) {
                dx = rx;
                dy = ry;
                rx = 0;
                ry = 0;
                w = this.imgs[imgnum].width;
                h = this.imgs[imgnum].height;
            }
            this.context.drawImage(this.imgs[imgnum], rx, ry, w, h, Math.floor(dx - w / 2), Math.floor(dy - h / 2), w, h);
            return true;
        };
        DrawCanvas.prototype.drawImageScaling = function (imgnum, rx, ry, w, h, dx, dy, scale, dh) {
            if (dh === void 0) { dh = undefined; }
            if (dh === undefined) {
                this.context.drawImage(this.imgs[imgnum], rx, ry, w, h, dx, dy, w * scale, h * scale);
            }
            else {
                this.context.drawImage(this.imgs[imgnum], rx, ry, w, h, dx, dy, scale, dh);
            }
            return true;
        };
        DrawCanvas.prototype.drawImageScalingC = function (imgnum, x, y, w, h, dx, dy, dw, dh) {
            if (dh === void 0) { dh = undefined; }
            if (dh === undefined) {
                dh = h * dw;
                dw = w * dw;
            }
            this.context.drawImage(this.imgs[imgnum], x, y, w, h, Math.floor(dx - dw / 2), Math.floor(dy - dh / 2), dw, dh);
            return true;
        };
        DrawCanvas.prototype.drawImageRotqtionC = function (imgnum, x, y, w, h, dx, dy, rad) {
            if (h === void 0) { h = undefined; }
            if (dx === void 0) { dx = undefined; }
            if (dy === void 0) { dy = undefined; }
            if (rad === void 0) { rad = undefined; }
            if (h === undefined) {
                rad = w;
                dx = x;
                dy = y;
                w = this.imgs[imgnum].width;
                h = this.imgs[imgnum].height;
                x = 0;
                y = 0;
            }
            this.context.save();
            this.context.translate(dx, dy);
            this.context.rotate(rad);
            this.context.drawImage(this.imgs[imgnum], x, y, w, h, -w / 2, -h / 2, w, h);
            this.context.restore();
            return true;
        };
        DrawCanvas.prototype.drawImageScaleRotateC = function (imgnum, rx, ry, w, h, dx, dy, dw, dh, rad) {
            if (dx === void 0) { dx = undefined; }
            if (dy === void 0) { dy = undefined; }
            if (dw === void 0) { dw = undefined; }
            if (dh === void 0) { dh = undefined; }
            if (rad === void 0) { rad = undefined; }
            if (dx === undefined) {
                rad = h;
                dw = this.imgs[imgnum].width * w;
                dh = this.imgs[imgnum].height * w;
                w = this.imgs[imgnum].width;
                h = this.imgs[imgnum].height;
                dx = rx;
                dy = ry;
                rx = 0;
                ry = 0;
            }
            else if (dy === undefined) {
                rad = dx;
                dh = h;
                dw = w;
                w = this.imgs[imgnum].width;
                h = this.imgs[imgnum].height;
                dx = rx;
                dy = ry;
                rx = 0;
                ry = 0;
            }
            else if (rad === undefined) {
                rad = dh;
                dh = h * dw;
                dw = w * dw;
            }
            else {
            }
            this.context.save();
            this.context.translate(dx, dy);
            this.context.rotate(rad);
            this.context.drawImage(this.imgs[imgnum], rx, ry, w, h, -dw / 2, -dh / 2, dw, dh);
            this.context.restore();
            return true;
        };
        DrawCanvas.prototype.setAlpha = function (alpha) {
            this.context.globalAlpha = alpha;
        };
        DrawCanvas.prototype.createFont = function (fontnum, fontsize, fontdata, color) {
            if (fontsize === void 0) { fontsize = 10; }
            if (fontdata === void 0) { fontdata = ""; }
            if (color === void 0) { color = "rgb(0,0,0)"; }
            this.fonts[fontnum] = new FontData();
            this.fonts[fontnum].fontdata = fontdata;
            this.fonts[fontnum].color = color;
            this.fonts[fontnum].size = fontsize;
        };
        DrawCanvas.prototype.print = function (fontnum, dx, dy, str) {
            if (!this.fonts[fontnum]) {
                fontnum = 0;
            }
            this.context.font = this.fonts[fontnum].fontdata;
            this.context.fillStyle = this.fonts[fontnum].color;
            dy += this.fonts[fontnum].size;
            this.context.fillText(str, dx, dy);
            return true;
        };
        return DrawCanvas;
    })();
    Jaffa.DrawCanvas = DrawCanvas;
    Jaffa.draw;
    Jaffa.system;
    Jaffa.input;
    var Game = (function () {
        function Game(canvasid) {
            if (canvasid === void 0) { canvasid = "gamescreen"; }
            if (Game.scene++ == 0) {
                Jaffa.system = new Jaffa.System();
                Jaffa.draw = new DrawCanvas();
                Jaffa.input = new Jaffa.Input();
                Jaffa.draw.setCanvas(canvasid);
                Jaffa.input.setCanvas(Jaffa.draw.getCanvas());
                Jaffa.system.setInput(Jaffa.input);
            }
            this.system = Jaffa.system;
            this.draw = Jaffa.draw;
            this.input = Jaffa.input;
        }
        Game.prototype.Start = function () {
            this.system.setNewGame(this);
            this.system.start();
        };
        Game.prototype.Stop = function () {
            this.system.stop();
        };
        Game.prototype.UserInit = function () {
        };
        Game.prototype.MainLoop = function () {
            return true;
        };
        Game.prototype.CleanUp = function () {
        };
        Game.scene = 0;
        return Game;
    })();
    Jaffa.Game = Game;
})(Jaffa || (Jaffa = {}));
