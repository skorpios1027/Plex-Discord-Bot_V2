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
		const embedObj = createEmbedObj();
		let listStart = offset + 1;
		let reply = 'Available albums (' + listStart + ' to ' + stoploop + ' of ' + albumList.length + '):\n';
		for (let i = offset; i < stoploop; i++) {
		  reply += '\t';
		  reply += albumList[i];
		  reply += '\n';
		}
		reply += '------------------------------------------------------------------\n';
		message.channel.send(reply);
		offset += pageSize;
	  }
    }
  }
};
