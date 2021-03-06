'use strict';

const KBase = require('../bot/KBase');
const Utils = require('../../lib/utils/Utils');
const AppConfig = require('../../config/AppConfig');
const InputWrap = require('../bot/InputWrap');
const _ = require('lodash');

const newline = '\n';

const BotCommands = {

  /*
  //TODO - FIXME - this is not working correctly
  announce: function(input) {
    const parts = input.params.split(' ');
    const roomName = parts[0];
    const text = parts.join(' ');
    this.bot.sayToRoom(text, roomName);
  },
  */

  archive: function(input) {
    const roomName = input.message.room.name;
    const shortName = InputWrap.roomShortName(input);
    const roomUri = AppConfig.gitterHost + roomName + '/archives/';
    const timeStamp = Utils.timeStamp('yesterday');

    return 'Archives for **' + shortName + '**' + newline +
      '\n- [All Time](' + roomUri + 'all)' +
      '\n- [Yesterday](' + roomUri + timeStamp + ')';
  },

  botenv: function() {
    return 'env: ' + AppConfig.serverEnv;
  },

  botstatus: function() {
    return 'All bot systems are go!  \n' + this.botversion() + newline +
      this.botenv() + newline + 'botname: ' + AppConfig.getBotName() + newline;
  },

  botversion: function() {
    return 'botVersion: ' + AppConfig.botVersion;
  },

  cbot: function(input, bot) {
    switch (input.params) {
      case 'version':
        return this.botversion(input, bot);
      case 'status':
        Utils.log('input', input);
        const status = this.botstatus(input, bot);
        Utils.clog('status', status);
        return status;
      default:
        return 'you called?';
    }
  },

  commands: function() {
    return '## commands:\n- ' + BotCommands.cmdList.join('\n- ');
  },

  eightball: function(input) {
    const fromUser = '@' + input.message.model.fromUser.username;
    const replies = [
      'it is certain', 'it is decidedly so', 'without a doubt',
      'yes. Definitely', 'you may rely on it', 'as I see it, yes',
      'most likely', 'outlook good', 'yes', 'signs point to yes',
      'reply hazy try again', 'ask again later', 'better not tell you now',
      'cannot predict now', 'concentrate and ask again', 'don\'t count on it',
      'my reply is no', 'my sources say no', 'outlook not so good',
      'very doubtful'
    ];

    var reply = replies[Math.floor(Math.random() * replies.length)];
    return fromUser + ' :8ball: ' + reply + ' :sparkles:';
  },

  find: function(input, bot) {
    const shortList = KBase.getTopicsAsList(input.params);

    bot.context = {
        state: 'finding',
        commands: shortList.commands
    };

    const str = 'find **' + input.params + '**\n' + shortList;
    bot.makeListOptions(str);
    return str;
  },

  init: function(bot) {
    // TODO - FIXME this is sketchy storing references like a global
    // called from the bot where we don't always have an instance
    BotCommands.bot = bot;
  },

  isCommand: function(input) {
    let res;

    const cmds = BotCommands.cmdList.filter(c => {
      return (c === input.keyword);
    });

    const one = cmds[0];
    if (one) {
      res = true;
    } else {
      res = false;
      // Todo : raisedadead : commenting out the below for clean up later
      /*
      Utils.warn('isCommand', 'not command', input);
      Utils.warn('isCommand',
        '[ isCommand: ' + input.keyword + ' one: ' + one + ' res: ' + res );
      */
    }
    return res;
  },

  music: function() {
    return '## Music!\n http://musare.com/';
  },

  // TODO - FIXME this isn't working it seems
  // rejoin: function (input, bot) {
  //     clog('GBot', GBot);
  //     BotCommands.bot.scanRooms();
  //     return 'rejoined';
  // },

  rooms: function() {
    return '#### freeCodeCamp rooms:' +
    '\n:point_right: Here is a [list of our official chat rooms]' +
    '(https://forum.freecodecamp.com/t/' +
    'free-code-camp-official-chat-rooms/19390)';
  },

  wiki: function() {
    return '#### freeCodeCamp Wiki:' +
    '\n:point_right: The freeCodeCamp wiki can be found on ' +
    '[our forum](https://forum.freecodecamp.org). ' +
    '\nPlease follow the link and search there.'
    ;
  }
};


// TODO - iterate and read all files in /cmds
const thanks = require('./cmds/thanks');

_.merge(BotCommands, thanks);

// aliases
BotCommands.explain = BotCommands.wiki;
BotCommands.thank = BotCommands.thanks;

// TODO - some of these should be filtered/as private
BotCommands.cmdList = Object.keys(BotCommands);

module.exports = BotCommands;
