const pageSize = 20;
var offset = 0;

module.exports = {
  name : 'albumlist',
  command : {
    usage: '',
    description: 'Print list of albums.',
    process: async function(bot, client, message, query) {
      if(Object.keys(bot.cache_library).length === 0) {
        await bot.loadLibrary();
      }
      let albumList = [];
	  let index = 0;
	  
	  for (key in bot.cache_library) {
		  try {
			  let res = await bot.plex.query('/library/sections/' + key + '/all?type=9');
			  for (let artist of res.MediaContainer.Metadata) {
				  albumList[index] = artist.parentTitle + ' - ' + artist.title
				  index ++
			  }
		  } catch (err) {
			  console.error(err);
		  }
	  }

	  for (let j = 0; j < albumList.length; j += pageSize) {
		let stoploop = offset + pageSize;
	    if(stoploop > albumList.length) {
		  stoploop = albumList.length;
	    }
		let listStart = offset + 1;
		let reply = 'Available albums (' + listStart + ' of ' + albumList.length + '):\n';
		for (let i = offset; i < stoploop; i++) {
		  reply += '\t';
		  reply += albumList[i];
		  reply += '\n';
		}
		message.channel.send(reply);
		offset += pageSize;
	  }
    }
  }
};

function createEmbedObj() {
  return {
    embed: {
      color: 0x00ff00,
      description: 'List of song : ',
      fields: [
        {
          name: 'Title',
          value: '',
          inline: true
        }, {
          name: 'Artist',
          value: '',
          inline: true
        }, {
          name: 'Album',
          value: '',
          inline: true
        }],
      footer: {
        text: '\u2800'.repeat(100)+"|"
      }
    }
  };
}

function sanitizeEmbedObj(embedObj) {
  console.dir(embedObj);
  for(let i = 0; i < embedObj.embed.fields.length; i++ ) {
    if(embedObj.embed.fields[i].value == '') {
      embedObj.embed.fields[i].value = '*None*';
    }
  }
  console.dir(embedObj);
}