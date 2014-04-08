module Jaffa
{
  export class System
  {
    private nextgame: Jaffa.Game;
    private game: Jaffa.Game;
    private fps: number;
    private run: boolean;
    private input: Jaffa.Input;
    //private beforetime: number;
    //private framecount: number;

    constructor()
    {
      this.nextgame = null;
      this.game = null;
      this.SetFPS(30.0);
      this.input = null;
      this.run = false;
    }

    private GameLoop() : boolean
    {
      if (this.nextgame != null)
      {
        if (this.game != null)
        {
          this.game.CleanUp();
        }
        this.game = this.nextgame;
        this.game.UserInit();
        this.nextgame = null;
      }

      return this.game.MainLoop();
    }

    public SetInput( input: Jaffa.Input ): boolean
    {
      this.input = input;
      return true;
    }

    public SetFPS(fps: number): boolean
    {
      this.fps = fps;
      //this.beforetime = + new Date();
      //this.framecount = 0;
      return true;
    }
    
    private Run(): boolean
    {
      //var now = +new Date();

      if ( this.GameLoop() && this.run )
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
          () => { this.Run(); },
          1000.0 / this.fps);//wait );
        if (this.input)
        {
          this.input.Renewal();
        }
        return true;
      }

      return false;
    }

    public Start(): boolean {
      if ( this.run == false )
      {
        this.run = true;
        this.Run();
      }
      return true;
    }

    public Stop(): boolean {
      this.run = false;
      return false;
    }
    
    public SetNewGame(game: Jaffa.Game): boolean
    {
      this.nextgame = game;
      return true;
    }

    public static GetBrowser(): string
    {
      var userAgent: string = window.navigator.userAgent.toLowerCase();

      if (userAgent.indexOf( 'msie' ) != -1)
      {
        var appVersion: string = window.navigator.appVersion.toLowerCase();
        if (appVersion.indexOf( 'msie 6.' ) != -1)
        {
          return 'ie 6';
        } else if (appVersion.indexOf( 'msie 7.' ) != -1)
        {
          return 'ie 7';
        } else if (appVersion.indexOf( 'msie 8.' ) != -1)
        {
          return 'ie 8';
        } else if (appVersion.indexOf( 'msie 9.' ) != -1)
        {
          return 'ie 9';
        } else if (appVersion.indexOf( 'msie 10.' ) != -1)
        {
          return 'ie 10';
        } else if (appVersion.indexOf('msie 11.') != -1)
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
      } else if (userAgent.indexOf( 'opera' ) != -1)
      {
        return 'opera';
      } else if ( userAgent.indexOf( 'safari' ) != -1 )
      {
        return 'safari';
      } else if ( userAgent.indexOf( 'android' ) != -1 )
      {
        if ( userAgent.indexOf('Mobile') == -1 )
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
      } else if (userAgent.indexOf('mobile') != -1)
      {
        return 'mobile';
      }

      return 'none';
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
    
    private MouseUp(ev: DragEvent): boolean
    {
      this.click = false;
      this.MouseEvent(ev);
      return false;
    }

    private MouseDown(ev: DragEvent): boolean
    {
      this.click = true;
      this.MouseEvent(ev);
      return false;
    }

    private MouseEvent(ev: DragEvent): boolean
    {
      if (ev.offsetX != undefined) {
        this.mx = ev.offsetX;//clientX;
        this.my = ev.offsetY;//clientY;
      } else
      {
        this.mx = ev.layerX;//clientX;
        this.my = ev.layerY;//clientY;
      }
      return false;
    }

    private TouchUp(ev: any): boolean
    {
      this.click = false;
      this.TouchEvent(ev);
      return false;
    }

    private TouchDown(ev: any): boolean
    {
      this.click = true;
      this.TouchEvent(ev);
      return false;
    }

    private TouchEvent(ev: any): boolean
    {
      this.mx = ev.touches[ 0 ].clientX - this.cx;
      this.my = ev.touches[0].clientY - this.cy;
      return false;
    }

    private KeyDown(ev: KeyboardEvent): boolean
    {
      this.key[ev.keyCode] = true;
      if (!(ev.keyCode in this.keyframe)) { this.keyframe[ev.keyCode] = 0;  }
      this.KeyEvent(ev);
      return true;
    }

    private KeyUp(ev: KeyboardEvent): boolean
    {
      this.key[ev.keyCode] = false;
      if (this.keyframe[ev.keyCode] == undefined)
      {
        this.keyframe[ev.keyCode] = 0;
      }
      this.KeyEvent(ev);
      return true;
    }

    private KeyEvent(ev: KeyboardEvent): boolean
    {
      // Shift, Ctrl, Alt ...
      return true;
    }
    
    public Renewal()
    {
      var key;
      if (this.click)
      {
        // click now
        ++this.clickframe;
      } else if (this.clickframe > 0)
      {
        this.clickframe = -1;
      } else if (this.clickframe < 0)
      {
        this.clickframe = 0;
      }

      for (key in this.key)
      {
        if (this.key[key])
        {
          // push now
          ++this.keyframe[key];
        } else if (this.keyframe[key] > 0)
        {
          this.keyframe[key] = -1;
        } else if (this.keyframe[key] < 0 )
        {
          this.keyframe[key] = 0;
        }
      }

    }

    public RemoveTouchEvent( canvas: HTMLCanvasElement = this.canvas ): boolean
    {
      if ( this.toucheventdown )
      {
        canvas.removeEventListener("touchstart", this.toucheventdown, false);
      }
      if (this.toucheventmove)
      {
        canvas.removeEventListener("touchmove", this.toucheventmove, false);
      }
      if (this.toucheventup)
      {
        canvas.removeEventListener("touchend", this.toucheventup, false);
      }
      this.toucheventdown = null;
      this.toucheventmove = null;
      this.toucheventup = null;
      return true;
    }

    public AddTouchEvent(canvas: HTMLCanvasElement): boolean;
    public AddTouchEvent(canvas: HTMLCanvasElement = this.canvas, mouseremove:boolean = true ): boolean
    {
      if ( mouseremove )
      {
        this.RemoveMouseEvent( canvas );
      } else if (this.toucheventdown != null || this.toucheventmove != null || this.toucheventup != null)
      {
        this.RemoveTouchEvent( canvas );
      }

      this.toucheventdown = ( ev ) => { this.TouchDown(ev) };
      this.toucheventmove = ( ev ) => { this.TouchEvent( ev ) };
      this.toucheventup   = ( ev ) => { this.TouchUp(ev) };

      canvas.addEventListener("touchstart", this.toucheventdown, false);
      canvas.addEventListener("touchmove", this.toucheventmove, false);
      canvas.addEventListener("touchend", this.toucheventup, false);
      return true;
    }

    public RemoveMouseEvent( canvas: HTMLCanvasElement = this.canvas ): boolean
    {
      if ( this.mouseeventdown != null )
      {
        canvas.removeEventListener("mousedown", this.mouseeventdown, false);
      }
      if (this.mouseeventmove != null)
      {
        canvas.removeEventListener("mousemove", this.mouseeventmove, false);
        canvas.removeEventListener("mouseover", this.mouseeventmove, false);
      }
      if ( this.mouseeventup != null )
      {
        canvas.removeEventListener("mouseout", this.mouseeventup, false);
        canvas.removeEventListener("mouseup", this.mouseeventup, false);
      }
      this.mouseeventdown = null;
      this.mouseeventup = null;
      return true;
    }

    public AddMouseEvent(canvas: HTMLCanvasElement): boolean;
    public AddMouseEvent(canvas: HTMLCanvasElement = this.canvas, touchremove: boolean = true): boolean {
      if ( touchremove )
      {
        this.RemoveTouchEvent(canvas);
      } else if (this.mouseeventdown != null || this.mouseeventmove != null || this.mouseeventup != null)
      {
        this.RemoveMouseEvent(canvas);
      }

      this.mouseeventdown = ( ev: DragEvent ) => { this.MouseDown( ev ) };
      this.mouseeventmove = ( ev: DragEvent ) => { this.MouseEvent( ev ) };
      this.mouseeventup   = ( ev: DragEvent ) => { this.MouseUp( ev ) };

      canvas.addEventListener("mousedown", this.mouseeventdown, false);
      canvas.addEventListener("mousemove", this.mouseeventmove, false);
      canvas.addEventListener("mouseover", this.mouseeventmove, false);
      canvas.addEventListener("mouseout", this.mouseeventup, false);
      canvas.addEventListener("mouseup", this.mouseeventup, false);

      return true;
    }

    public RemoveKeyEvent(): boolean
    {
      if (this.keyeventdown)
      {
        window.removeEventListener("keydown", this.keyeventdown, false);
      } else if (this.keyeventup)
      {
        window.removeEventListener("keyup", this.keyeventup, false);
      }
      this.keyeventdown = null;
      this.keyeventup = null;
      return true;
    }

    public AddKeyEvent(): boolean
    {

      this.keyeventdown = (ev: KeyboardEvent) => { this.KeyDown(ev) };
      this.keyeventup = (ev: KeyboardEvent) => { this.KeyUp(ev) };

      window.addEventListener("keydown", this.keyeventdown, false);
      window.addEventListener("keyup", this.keyeventup, false);
      return true;
    }

    public static CanUseTouch(): boolean
    {
      return ( ('createTouch' in document) || ('ontouchstart' in document) );//ontouchstart === undefined )
    }

    private ResetCanvasPosition_(): boolean
    {
      var html = document.documentElement;
      var body = document.body;
      var rect = this.canvas.getBoundingClientRect();

      this.cx = rect.left - html.clientLeft + (body.scrollLeft || html.scrollLeft);
      this.cy = rect.top - html.clientTop + (body.scrollTop || html.scrollTop);

      this.scrolltimeron = false;

      //document.getElementById( "scroll" ).innerHTML = this.cx + "," + this.cy;
      return true;
    }

    public ResetCanvasPosition(): boolean
    {
      if ( this.scrolltimeron )
      {
        clearTimeout( this.scrolltimer );
      }
      this.scrolltimeron = true;
      this.scrolltimer = setTimeout(() => { this.ResetCanvasPosition_(); }, 100 );
      return true;
    }

    public SetCanvas(canvas: HTMLCanvasElement): boolean
    {
      //canvas.addEventListener("click", (ev: DragEvent) => { this.ClickEvent(ev) }, false);
      this.canvas = canvas;

      if (Input.CanUseTouch())
      {
        this.AddTouchEvent(canvas);
        this.AddMouseEvent(canvas);
      } else
      {
        this.AddMouseEvent( canvas );
      }
      this.AddKeyEvent();
      
      //this.cx = canvas.offsetLeft;
      //this.cy = canvas.offsetTop;
      this.ResetCanvasPosition();

      window.addEventListener( "scroll", () => { this.ResetCanvasPosition(); }, false );
      
      return true;
    }

    public GetX(): number
    {
      return this.mx;
    }

    public GetY(): number
    {
      return this.my;
    }

    public GetMouse(): number
    {
      return this.clickframe;
    }

    public GetKeyNum(keynum: number): number
    {
      if (this.keyframe[keynum]) { return this.keyframe[keynum];}
      return 0;
    }
  }

  export class Net
  {
    private HttpCreate(): XMLHttpRequest
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

    public HttpGet(address: string, senddata:string = null ): string
    {
      //オブジェクトを生成してもらう
      var httpobj: XMLHttpRequest = this.HttpCreate();

      if ( httpobj )
      {
        httpobj.open( "GET", address, false );
        httpobj.send( senddata );
        return httpobj.responseText;
      }
      return "";
    }

    public HttpGet_(address: string, func: any = null): string {
      //オブジェクトを生成してもらう
      var httpobj: XMLHttpRequest = this.HttpCreate();

      if (httpobj)
      {
        if (func)
        {
          httpobj.onreadystatechange = func;
          httpobj.open("GET", address, true);
          httpobj.send(null);
          return "";//httpobj;
        } else
        {
          httpobj.open("GET", address, false);
          httpobj.send(null);
          return httpobj.responseText;
        }
      }
      return "";
    }
  }

  class FontData {
    public fontdata: string;
    public color: string;
  }

  export class DrawCanvas //implements JaffaDraw.Draw
  {
    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    private imgs: { [key: number]: HTMLImageElement; } = {};
    private fonts: { [key: number]: FontData; } = {};

    constructor() {
    }

    public GetCanvas(): HTMLCanvasElement {
      return this.canvas;
    }

    public SetCanvas(canvasid: string): boolean;
    public SetCanvas(canvas: HTMLCanvasElement): boolean;
    SetCanvas(value: any): boolean {
      if (typeof (value) == "string") {
        this.canvas = <HTMLCanvasElement>document.getElementById(value);
      } else {
        this.canvas = value;
      }

      this.context = this.canvas.getContext("2d");

      return true;
    }

    public SetCanvasScale(scale: number): boolean {
      this.context.scale(scale, scale);
      return true;
    }

    public LoadImage(imgnum: number, imgaddress: string): boolean {
      this.imgs[imgnum] = new Image();

      this.imgs[imgnum].src = imgaddress; // Load image start.

      return true;
    }

    public ClearScreen(): boolean {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return true;
    }

    public DrawBox(dx: number, dy: number, w: number, h: number, color: any): boolean {
      //var a = "rgba( 192, 80, 77, 255 )";
      this.context.fillStyle = color;
      this.context.fillRect(dx, dy, w, h);
      return true;
    }

    public DrawImage(imgnum: number, rx: number, ry: number, w: number, h: number, dx: number, dy: number): boolean {
      this.context.drawImage(this.imgs[imgnum], rx, ry, w, h, Math.floor(dx), Math.floor(dy), w, h);
      return true;
    }

    public DrawImageC(imgnum: number, rx: number, ry: number, w: number, h: number, dx: number, dy: number): boolean {
      this.context.drawImage(this.imgs[imgnum], rx, ry, w, h, Math.floor(dx - w / 2), Math.floor(dy - h / 2), w, h);
      return true;
    }

    public CreateFont(fontnum: number, fontdata: string, color: string) {
      this.fonts[fontnum] = new FontData();
      this.fonts[fontnum].fontdata = fontdata;
      this.fonts[fontnum].color = color;
    }

    public Print(fontnum: number, dx: number, dy: number, str: string): boolean {
      if (this.fonts[fontnum]) {
        this.context.font = this.fonts[fontnum].fontdata;
        this.context.fillStyle = this.fonts[fontnum].color;
      } else {
        this.context.fillStyle = "rgb(0,0,0)";
      }
      this.context.fillText(str, dx, dy);
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

    constructor( canvasid:string = "gamescreen")
    {
      if (Game.scene++ == 0)
      {
        system = new Jaffa.System();
        draw = new DrawCanvas();
        input = new Jaffa.Input();
        draw.SetCanvas(canvasid);
        input.SetCanvas(draw.GetCanvas());
        system.SetInput(input);
      }
      this.system = system;
      this.draw = draw;
      this.input = input;
    }

    public Start()
    {
      this.system.SetNewGame( this );
      this.system.Start();
    }

    public Stop()
    {
      this.system.Stop();
    }

    // User method.
    UserInit() { }
    MainLoop(): boolean { return true; }
    CleanUp() { }
  }
}

