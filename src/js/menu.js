(function() {
  'use strict';

  function Menu() {
    this.titleTxt = null;
    this.startTxt = null;
  }

  Menu.prototype = {

    create: function () {
      var x = this.game.width / 2
        , y = this.game.height / 2,
        margin = 20;


      y = y - 120;
      this.titleTxt = this.add.bitmapText(x, y, 'minecraftia', 'pixElement');
      this.titleTxt.align = 'center';
      this.titleTxt.x = this.game.width / 2 - this.titleTxt.textWidth / 2;

      y = y + this.titleTxt.height + margin;
      this.startTxt = this.add.bitmapText(x, y, 'minecraftia', 'START');
      this.startTxt.align = 'center';
      this.startTxt.x = this.game.width / 2 - this.startTxt.textWidth / 2;

      y = y + this.titleTxt.height + margin*2;
      this.startTxt = this.add.bitmapText(x, y, 'minecraftia', 'last score:\n ' + this.game.points + ' points');
      this.startTxt.align = 'center';
      this.startTxt.x = this.game.width / 2 - this.startTxt.textWidth / 2;

      this.input.onDown.add(this.onDown, this);
    },

    update: function () {

    },

    onDown: function () {
      this.game.state.start('game');
    }
  };

  window['testaculo'] = window['testaculo'] || {};
  window['testaculo'].Menu = Menu;

}());
