// TODO: anmaton farme
// window.requestAnimationFrame

module Jaffa
{
	export class System
	{
		private nextgame: Jaffa.Game;
		private game: Jaffa.Game;
		private fps: number;
		private isrun: boolean;
		private input: Jaffa.Input;
		//private beforetime: number;
		//private framecount: number;

		constructor()
		{
			this.nextgame = null;
			this.game = null;
			this.setFPS( 30.0 );
			this.input = null;
			this.isrun = false;
		}

		private gameLoop(): boolean
		{
			if ( this.nextgame != null )
			{
				if ( this.game != null )
				{
					this.game.CleanUp();
				}
				this.game = this.nextgame;
				this.game.UserInit();
				this.nextgame = null;
			}

			return this.game.MainLoop();
		}

		public isRun(): boolean { return this.isrun; }

		public setInput( input: Jaffa.Input ): boolean
		{
			this.input = input;
			return true;
		}

		public setFPS( fps: number ): boolean
		{
			this.fps = fps;
			//this.beforetime = + new Date();
			//this.framecount = 0;
			return true;
		}

		private run(): boolean
		{
			//var now = +new Date();

			if ( this.gameLoop() && this.isrun )
			{
				//var wait;
				//if ( this.framecount >= this.fps )
				//{
				//  this.framecount = 0;
				//  this.beforetime = + new Date();
				//}
				//wait = this.framecount * 1000.0 / this.fps - (now - this.beforetime);
				//++this.framecount;
				//setTimeout( JaffaData.system.Run, 1000);
				setTimeout(
					() => { this.run(); },
					1000.0 / this.fps );//wait );
				if ( this.input )
				{
					this.input.renewal();
				}
				return true;
			}

			return false;
		}

		public start(): boolean
		{
			if ( this.isrun == false )
			{
				this.isrun = true;
				this.run();
			}
			return true;
		}

		public stop(): boolean
		{
			this.isrun = false;
			return false;
		}

		public setNewGame( game: Jaffa.Game ): boolean
		{
			this.nextgame = game;
			return true;
		}

		public static getBrowser(): string
		{
			var userAgent: string = window.navigator.userAgent.toLowerCase();

			if ( userAgent.indexOf( 'msie' ) != -1 )
			{
				var appVersion: string = window.navigator.appVersion.toLowerCase();
				if ( appVersion.indexOf( 'msie 6.' ) != -1 )
				{
					return 'ie 6';
				} else if ( appVersion.indexOf( 'msie 7.' ) != -1 )
				{
					return 'ie 7';
				} else if ( appVersion.indexOf( 'msie 8.' ) != -1 )
				{
					return 'ie 8';
				} else if ( appVersion.indexOf( 'msie 9.' ) != -1 )
				{
					return 'ie 9';
				} else if ( appVersion.indexOf( 'msie 10.' ) != -1 )
				{
					return 'ie 10';
				} else if ( appVersion.indexOf( 'msie 11.' ) != -1 )
				{
					return 'ie 11';
				}
				return 'ie 0';
			} else if ( userAgent.indexOf( 'chrome' ) != -1 )
			{
				return 'chrome';
			} else if ( userAgent.indexOf( 'gecko' ) != -1 )
			{
				return 'gecko';
			} else if ( userAgent.indexOf( 'opera' ) != -1 )
			{
				return 'opera';
			} else if ( userAgent.indexOf( 'safari' ) != -1 )
			{
				return 'safari';
			} else if ( userAgent.indexOf( 'android' ) != -1 )
			{
				if ( userAgent.indexOf( 'Mobile' ) == -1 )
				{
					return 'android mobile';
				}
				return 'android tablet';
			} else if ( userAgent.indexOf( 'ipad' ) != -1 )
			{
				return 'ipad';
			} else if ( userAgent.indexOf( 'ipod' ) != -1 )
			{
				return 'ipod';
			} else if ( userAgent.indexOf( 'iphone' ) != -1 )
			{
				return 'iphone';
			} else if ( userAgent.indexOf( 'mobile' ) != -1 )
			{
				return 'mobile';
			}

			return 'none';
		}
		public static isiOS(): boolean
		{
			var userAgent: string = window.navigator.userAgent.toLowerCase();
			if ( userAgent.indexOf( 'ipad' ) != -1 ||
				userAgent.indexOf( 'ipod' ) != -1 ||
				userAgent.indexOf( 'iphone' ) != -1 )
			{
				return true;
			}
			return false;
		}
	} // System

	export class Input
	{
		private mx: number;
		private my: number;
		private cx: number;
		private cy: number;
		private clickframe: number;
		private click: boolean;
		private keyframe: { [key: number]: number } = {};
		private key: { [key: number]: boolean } = {};
		private mouseeventdown: EventListener;
		private mouseeventmove: EventListener;
		private mouseeventup: EventListener;
		private toucheventdown: EventListener;
		private toucheventmove: EventListener;
		private toucheventup: EventListener;
		private keyeventdown: EventListener;
		private keyeventup: EventListener;
		private canvas: HTMLCanvasElement;
		private scrolltimer: number;
		private scrolltimeron: boolean;
		public static K_LEFT: number = 37;
		public static K_UP: number = 38;
		public static K_RIGHT: number = 39;
		public static K_DOWN: number = 40;
		public static K_SPACE: number = 32;

		constructor()
		{
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

		private mouseUp( ev: DragEvent ): boolean
		{
			this.click = false;
			this.mouseEvent( ev );
			return false;
		}

		private mouseDown( ev: DragEvent ): boolean
		{
			this.click = true;
			this.mouseEvent( ev );
			return false;
		}

		private mouseEvent( ev: DragEvent ): boolean
		{
			if ( ev.offsetX != undefined )
			{
				this.mx = ev.offsetX;//clientX;
				this.my = ev.offsetY;//clientY;
			} else
			{
				this.mx = ev.layerX;//clientX;
				this.my = ev.layerY;//clientY;
			}
			return false;
		}

		private touchUp( ev: any ): boolean
		{
			this.click = false;
			//this.touchEvent( ev );
			return false;
		}

		private touchDown( ev: any ): boolean
		{
			this.click = true;
			this.touchEvent( ev );
			return false;
		}

		private touchEvent( ev: any ): boolean
		{
			this.mx = ev.touches[0].clientX - this.cx;
			this.my = ev.touches[0].clientY - this.cy;
			return false;
		}

		private keyDown( ev: KeyboardEvent ): boolean
		{
			this.key[ev.keyCode] = true;
			if ( !( ev.keyCode in this.keyframe ) ) { this.keyframe[ev.keyCode] = 0; }
			this.keyEvent( ev );
			return true;
		}

		private keyUp( ev: KeyboardEvent ): boolean
		{
			this.key[ev.keyCode] = false;
			if ( this.keyframe[ev.keyCode] == undefined )
			{
				this.keyframe[ev.keyCode] = 0;
			}
			this.keyEvent( ev );
			return true;
		}

		private keyEvent( ev: KeyboardEvent ): boolean
		{
			// Shift, Ctrl, Alt ...
			return true;
		}

		public renewal()
		{
			var key;
			if ( this.click )
			{
				// click now
				++this.clickframe;
			} else if ( this.clickframe > 0 )
			{
				this.clickframe = -1;
			} else if ( this.clickframe < 0 )
			{
				this.clickframe = 0;
			}

			for ( key in this.key )
			{
				if ( this.key[key] )
				{
					// push now
					++this.keyframe[key];
				} else if ( this.keyframe[key] > 0 )
				{
					this.keyframe[key] = -1;
				} else if ( this.keyframe[key] < 0 )
				{
					this.keyframe[key] = 0;
				}
			}

		}

		public removeTouchEvent( canvas: HTMLCanvasElement = this.canvas ): boolean
		{
			if ( this.toucheventdown )
			{
				canvas.removeEventListener( "touchstart", this.toucheventdown, false );
			}
			if ( this.toucheventmove )
			{
				canvas.removeEventListener( "touchmove", this.toucheventmove, false );
			}
			if ( this.toucheventup )
			{
				canvas.removeEventListener( "touchend", this.toucheventup, false );
			}
			this.toucheventdown = null;
			this.toucheventmove = null;
			this.toucheventup = null;
			return true;
		}

		public addTouchEvent( canvas: HTMLCanvasElement ): boolean;
		public addTouchEvent( canvas: HTMLCanvasElement = this.canvas, mouseremove: boolean = true ): boolean
		{
			/*if ( mouseremove )
			{
				this.removeMouseEvent( canvas );
			} else if ( this.toucheventdown != null || this.toucheventmove != null || this.toucheventup != null )
			{
				this.removeTouchEvent( canvas );
			}*/

			this.toucheventdown = ( ev ) => { this.touchDown( ev ) };
			this.toucheventmove = ( ev ) => { this.touchEvent( ev ) };
			this.toucheventup = ( ev ) => { this.touchUp( ev ) };

			canvas.addEventListener( "touchstart", this.toucheventdown, false );
			canvas.addEventListener( "touchmove", this.toucheventmove, false );
			canvas.addEventListener( "touchend", this.toucheventup, false );
			return true;
		}

		public removeMouseEvent( canvas: HTMLCanvasElement = this.canvas ): boolean
		{
			if ( this.mouseeventdown != null )
			{
				canvas.removeEventListener( "mousedown", this.mouseeventdown, false );
			}
			if ( this.mouseeventmove != null )
			{
				canvas.removeEventListener( "mousemove", this.mouseeventmove, false );
				canvas.removeEventListener( "mouseover", this.mouseeventmove, false );
			}
			if ( this.mouseeventup != null )
			{
				canvas.removeEventListener( "mouseout", this.mouseeventup, false );
				canvas.removeEventListener( "mouseup", this.mouseeventup, false );
			}
			this.mouseeventdown = null;
			this.mouseeventup = null;
			return true;
		}

		public addMouseEvent( canvas: HTMLCanvasElement ): boolean;
		public addMouseEvent( canvas: HTMLCanvasElement = this.canvas, touchremove: boolean = true ): boolean
		{
			/*if ( touchremove )
			{
				this.removeTouchEvent( canvas );
			} else if ( this.mouseeventdown != null || this.mouseeventmove != null || this.mouseeventup != null )
			{
				this.removeMouseEvent( canvas );
			}*/

			this.mouseeventdown = ( ev: DragEvent ) => { this.mouseDown( ev ) };
			this.mouseeventmove = ( ev: DragEvent ) => { this.mouseEvent( ev ) };
			this.mouseeventup = ( ev: DragEvent ) => { this.mouseUp( ev ) };

			canvas.addEventListener( "mousedown", this.mouseeventdown, false );
			canvas.addEventListener( "mousemove", this.mouseeventmove, false );
			canvas.addEventListener( "mouseover", this.mouseeventmove, false );
			canvas.addEventListener( "mouseout", this.mouseeventup, false );
			canvas.addEventListener( "mouseup", this.mouseeventup, false );

			return true;
		}

		public removeKeyEvent(): boolean
		{
			if ( this.keyeventdown )
			{
				window.removeEventListener( "keydown", this.keyeventdown, false );
			} else if ( this.keyeventup )
			{
				window.removeEventListener( "keyup", this.keyeventup, false );
			}
			this.keyeventdown = null;
			this.keyeventup = null;
			return true;
		}

		public addKeyEvent(): boolean
		{
			this.keyeventdown = ( ev: KeyboardEvent ) => { this.keyDown( ev ) };
			this.keyeventup = ( ev: KeyboardEvent ) => { this.keyUp( ev ) };

			window.addEventListener( "keydown", this.keyeventdown, false );
			window.addEventListener( "keyup", this.keyeventup, false );
			return true;
		}

		public static canUseTouch(): boolean
		{
			return ( ( 'createTouch' in document ) || ( 'ontouchstart' in document ) );//ontouchstart === undefined )
		}

		private resetCanvasPosition_(): boolean
		{
			var html = document.documentElement;
			var body = document.body;
			var rect = this.canvas.getBoundingClientRect();

			this.cx = rect.left - html.clientLeft + ( body.scrollLeft || html.scrollLeft );
			this.cy = rect.top - html.clientTop + ( body.scrollTop || html.scrollTop );

			this.scrolltimeron = false;

			//document.getElementById( "scroll" ).innerHTML = this.cx + "," + this.cy;
			return true;
		}

		public resetCanvasPosition(): boolean
		{
			if ( this.scrolltimeron )
			{
				clearTimeout( this.scrolltimer );
			}
			this.scrolltimeron = true;
			this.scrolltimer = setTimeout( () => { this.resetCanvasPosition_(); }, 100 );
			return true;
		}

		public setCanvas( canvas: HTMLCanvasElement ): boolean
		{
			//canvas.addEventListener("click", (ev: DragEvent) => { this.ClickEvent(ev) }, false);
			this.canvas = canvas;

			if ( Input.canUseTouch() )
			{
				this.addTouchEvent( canvas );
				this.addMouseEvent( canvas );
			} else
			{
				this.addMouseEvent( canvas );
			}
			this.addKeyEvent();

			//this.cx = canvas.offsetLeft;
			//this.cy = canvas.offsetTop;
			this.resetCanvasPosition();

			window.addEventListener( "scroll", () => { this.resetCanvasPosition(); }, false );

			return true;
		}

		public getX(): number
		{
			return this.mx;
		}

		public getY(): number
		{
			return this.my;
		}

		public getMouse(): number
		{
			return this.clickframe;
		}

		public getKeyNum( keynum: number ): number
		{
			if ( this.keyframe[keynum] ) { return this.keyframe[keynum]; }
			return 0;
		}
	}

	export class Net
	{
		private httpCreate(): XMLHttpRequest
		{
			var httpobj: XMLHttpRequest = null;
			try
			{
				httpobj = new XMLHttpRequest();
			} catch ( e )
			{
				try
				{
					httpobj = new ActiveXObject( "Msxml2.XMLHTTP" );
				} catch ( e )
				{
					try
					{
						httpobj = new ActiveXObject( "Microsoft.XMLHTTP" );
					} catch ( e )
					{
						return null;
					}
				}
			}
			return httpobj;
		}

		public httpGet( address: string, senddata: string = null ): string
		{
			//オブジェクトを生成してもらう
			var httpobj: XMLHttpRequest = this.httpCreate();

			if ( httpobj )
			{
				httpobj.open( "GET", address, false );
				httpobj.send( senddata );
				return httpobj.responseText;
			}
			return "";
		}

		public httpGet_( address: string, func: any = null ): string
		{
			//オブジェクトを生成してもらう
			var httpobj: XMLHttpRequest = this.httpCreate();

			if ( httpobj )
			{
				if ( func )
				{
					httpobj.onreadystatechange = func;
					httpobj.open( "GET", address, true );
					httpobj.send( null );
					return "";//httpobj;
				} else
				{
					httpobj.open( "GET", address, false );
					httpobj.send( null );
					return httpobj.responseText;
				}
			}
			return "";
		}
	}

	class FontData
	{
		public fontdata: string;
		public color: string;
		public size: number;
	}

	export class DrawCanvas //implements JaffaDraw.Draw
	{
		public canvas: HTMLCanvasElement;
		public context: CanvasRenderingContext2D;
		private imgs: { [key: number]: HTMLImageElement; } = {};
		private fonts: { [key: number]: FontData; } = {};

		constructor()
		{
			this.createFont( 0 );
		}

		public getCanvas(): HTMLCanvasElement
		{
			return this.canvas;
		}

		public getImage(imgnum:number):HTMLImageElement
		{
			return this.imgs[imgnum];
		}

		public setCanvas( canvasid: string ): boolean;
		public setCanvas( canvas: HTMLCanvasElement ): boolean;
		setCanvas( value: any ): boolean
		{
			if ( typeof ( value ) == "string" )
			{
				this.canvas = <HTMLCanvasElement>document.getElementById( value );
			} else
			{
				this.canvas = value;
			}

			this.context = this.canvas.getContext( "2d" );
			
			this.enableDrawPixelMode();

			return true;
		}

		public enableDrawPixelMode( enable: boolean = true )
		{
			enable = !enable;
			var ctx: any = this.context;
			if ( ctx.imageSmoothingEnabled === undefined || System.isiOS() )
			{
				ctx.webkitImageSmoothingEnabled = enable;
			}
			ctx.imageSmoothingEnabled = enable;
			ctx.mozImageSmoothingEnabled = enable;
			ctx.msImageSmoothingEnabled = enable;
		}

		public setCanvasScale( scale: number ): boolean
		{
			this.context.scale( scale, scale );
			return true;
		}

		public loadImage(imgnum: number, imgaddress: string): boolean;
		public loadImage(imgnum: number, imgelement: HTMLImageElement ): boolean;
		loadImage(imgnum: number, img:any): boolean
		{
			if (typeof (img) == "string")
			{
				this.imgs[imgnum] = new Image();
				this.imgs[imgnum].src = img; // Load image start.
			} else
			{
				this.imgs[imgnum] = img;
			}
			return true;
		}

		public clearScreen(): boolean
		{
			this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
			return true;
		}

		public drawBox( dx: number, dy: number, w: number, h: number, color: any ): boolean
		{
			//var a = "rgba( 192, 80, 77, 255 )";
			this.context.fillStyle = color;
			this.context.fillRect( dx, dy, w, h );
			return true;
		}

		public drawImage(imgnum: number, dx: number, dy: number): boolean;
		public drawImage(imgnum: number, rx: number, ry: number, w: number, h: number, dx: number, dy: number): boolean;
		drawImage(imgnum: number, x: number, y: number, w: any = undefined, h: any = undefined, dx: any = undefined, dy: any = undefined ): boolean
		{
			//ctx.scale(-1, 1);
			if (w === undefined)
			{
				this.context.drawImage(this.imgs[imgnum], 0, 0, this.imgs[imgnum].width, this.imgs[imgnum].height, Math.floor(x), Math.floor(y), this.imgs[imgnum].width, this.imgs[imgnum].height);
			} else
			{
				this.context.drawImage(this.imgs[imgnum], x, y, w, h, Math.floor(dx), Math.floor(dy), w, h);
			}
			return true;
		}

		public drawImageC(imgnum: number, dx: number, dy: number): boolean;
		public drawImageC(imgnum: number, rx: number, ry: number, w: number, h: number, dx: number, dy: number): boolean;
		drawImageC(imgnum: number, rx: number, ry: number, w: any = undefined, h: any = undefined, dx: any = undefined, dy: any = undefined): boolean
		{
			if (w === undefined)
			{
				dx = rx;
				dy = ry;
				rx = 0;
				ry = 0;
				w = this.imgs[imgnum].width;
				h = this.imgs[imgnum].height;
			}
			this.context.drawImage(this.imgs[imgnum], rx, ry, w, h, Math.floor(dx - w / 2), Math.floor(dy - h / 2), w, h);
			return true;
		}

		public drawImageScaling( imgnum: number, rx: number, ry: number, w: number, h: number, dx: number, dy: number, scale: number ): boolean;
		public drawImageScaling( imgnum: number, rx: number, ry: number, w: number, h: number, dx: number, dy: number, dw: number, dh: number ): boolean;
		drawImageScaling( imgnum: number, rx: number, ry: number, w: number, h: number, dx: number, dy: number, scale: number, dh:any = undefined )
		{
			if ( dh === undefined )
			{
				this.context.drawImage( this.imgs[imgnum], rx, ry, w, h, dx, dy, w * scale, h * scale );
			} else
			{
				this.context.drawImage( this.imgs[imgnum], rx, ry, w, h, dx, dy, scale, dh );
			}
			return true;
		}

		//public drawImageScalingC(imgnum: number, dx: number, dy: number, scale: number): boolean;
		//public drawImageScalingC(imgnum: number, dx: number, dy: number, dw: number, dh: number): boolean;
		public drawImageScalingC(imgnum: number, rx: number, ry: number, w: number, h: number, dx: number, dy: number, scale: number): boolean;
		public drawImageScalingC(imgnum: number, rx: number, ry: number, w: number, h: number, dx: number, dy: number, dw: number, dh: number): boolean;
		drawImageScalingC(imgnum: number, x: number, y: number, w: number, h: number, dx: number, dy: number, dw: number, dh: any = undefined): boolean
		{
			if (dh === undefined)
			{
				dh = h * dw;
				dw = w * dw;
			}
			this.context.drawImage(this.imgs[imgnum], x, y, w, h, Math.floor(dx - dw / 2), Math.floor(dy - dh / 2), dw, dh);
			return true;
		}

		public drawImageRotqtionC(imgnum: number, dx: number, dy: number, rad: number): boolean;
		public drawImageRotqtionC(imgnum: number, rx: number, ry: number, w: number, h: number, dx: number, dy: number, rad: number): boolean;
		drawImageRotqtionC(imgnum: number, x: number, y: number, w: number, h: any = undefined, dx: any = undefined, dy: any = undefined, rad: any = undefined): boolean
		{
			if (h === undefined)
			{
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
			this.context.drawImage(this.imgs[imgnum], x, y, w, h, -w/2, -h/2, w, h);
			this.context.restore();
			return true;
		}

		public drawImageScaleRotateC(imgnum: number, dx: number, dy: number, scale: number, rad: number): boolean;
		public drawImageScaleRotateC(imgnum: number, dx: number, dy: number, dw: number, dh: number, rad: number): boolean;
		public drawImageScaleRotateC(imgnum: number, rx: number, ry: number, w: number, h: number, scale: number, rad: number): boolean;
		public drawImageScaleRotateC(imgnum: number, rx: number, ry: number, w: number, h: number, dx: number, dy: number, scale:number, rad: number): boolean;
		drawImageScaleRotateC(imgnum: number, rx: number, ry: number, w: number, h: number, dx: any = undefined, dy: any = undefined, dw:number = undefined, dh:number = undefined, rad: any = undefined): boolean
		{
			
			if (dx === undefined)
			{
				rad = h;
				dw = this.imgs[imgnum].width * w;
				dh = this.imgs[imgnum].height * w;
				w = this.imgs[imgnum].width;
				h = this.imgs[imgnum].height;
				dx = rx;
				dy = ry;
				rx = 0;
				ry = 0;
			} else if (dy === undefined)
			{
				rad = dx;
				dh = h;
				dw = w;
				w = this.imgs[imgnum].width;
				h = this.imgs[imgnum].height;
				dx = rx;
				dy = ry;
				rx = 0;
				ry = 0;
			} else if (rad === undefined)
			{
				rad = dh;
				dh = h * dw;
				dw = w * dw;
			} else
			{
			}
			this.context.save();
			this.context.translate(dx, dy);
			this.context.rotate(rad);
			this.context.drawImage(this.imgs[imgnum], rx, ry, w, h, -dw / 2, -dh / 2, dw, dh);
			this.context.restore();
			return true;
		}

		public setAlpha( alpha: number )
		{
			this.context.globalAlpha = alpha;
		}

		public createFont( fontnum: number, fontsize: number = 10, fontdata: string = "", color: string = "rgb(0,0,0)" )
		{
			this.fonts[fontnum] = new FontData();
			this.fonts[fontnum].fontdata = fontdata;
			this.fonts[fontnum].color = color;
			this.fonts[fontnum].size = fontsize;
		}

		public print( fontnum: number, dx: number, dy: number, str: string ): boolean
		{
			if ( !this.fonts[fontnum] )
			{
				fontnum = 0;
			}
			this.context.font = this.fonts[fontnum].fontdata;
			this.context.fillStyle = this.fonts[fontnum].color;
			dy += this.fonts[fontnum].size;
			this.context.fillText( str, dx, dy );
			return true;
		}
	} // Draw

	export var draw: DrawCanvas;
	export var system: Jaffa.System;
	export var input: Jaffa.Input;

	export class Game
	{
		private static scene: number = 0;
		public draw: DrawCanvas;
		public system: Jaffa.System;
		public input: Jaffa.Input;

		constructor( canvasid: string = "gamescreen" )
		{
			if ( Game.scene++ == 0 )
			{
				system = new Jaffa.System();
				draw = new DrawCanvas();
				input = new Jaffa.Input();
				draw.setCanvas( canvasid );
				input.setCanvas( draw.getCanvas() );
				system.setInput( input );
			}
			this.system = system;
			this.draw = draw;
			this.input = input;
		}

		public Start()
		{
			this.system.setNewGame( this );
			this.system.start();
		}

		public Stop()
		{
			this.system.stop();
		}

		// User method.
		UserInit() { }
		MainLoop(): boolean { return true; }
		CleanUp() { }
	}
} 