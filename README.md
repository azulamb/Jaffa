# Jaffa - Game library for TypeScript
=====

Jaffa is Game library for TypeScript.

## HOW TO USE

### HTML

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>TypeScript HTML App</title>
        <link rel="stylesheet" href="app.css" type="text/css" />
        <script src="Jaffa.js"></script>
        <script src="top.js"></script>
    </head>
    <body>
        <canvas id="gamescreen" width="400" height="300"></canvas>
    </body>
    </html>

### TypeScript

    /// <reference path="Jaffa.ts"/>

    class Game extends Jaffa.Game
    {
      // override
      // prepare. call first.
      public UserInit()
      {
      }
      
      // override
      // call 30/sec.
      public MainLoop() : boolean
      {
        // clear canvas screen.
        this.draw.clearScreen();
        
        // return false; is end.
        return true;
      }
      
      // override
      // cleanup. call last.
      public CleanUp()
      {
      }
    }

    window.onload = () => {
      var game:Jaffa.Game = new Game();
      game.Start();
    };

## HOW TO BUILD
