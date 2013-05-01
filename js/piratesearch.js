function getTorrentSearch(str)
{
	if(str!="")
	{
		var feedurl = "http://apify.ifc0nfig.com/tpb/search?id="+str+"&$top=10";
		console.log("Torrent Search");
        jQuery.ajax(
		{
            url: feedurl,
            dataType: 'json',
            data: 'data',
            success: function(data)
			{
				$("#searchTorrentOutput ul").empty();
				for(var x=0; x<10; x++)
				{
				$("#searchTorrentOutput ul").append("<li><a onclick=queueMagnet('"+data[x].magnet+"'); href=#queue>"+data[x].name+" - S:"+data[x].seeders+" L:"+data[x].leechers+"</a></li>");
				}
				
				$("#searchTorrentOutput ul").listview('refresh');
            } 
			
         });
	}
}
function appendTorrents(titleName, titleType)
{
		if(titleType=="all")
		var feedurl = "http://apify.ifc0nfig.com/tpb/search?id="+titleName+"&$top=5";
		else
		var feedurl = "http://apify.ifc0nfig.com/tpb/search?id="+titleName+"&$filter=category%20eq%20'"+titleType+"'&$top=5";
        jQuery.ajax(
		{
            url: feedurl,
            dataType: 'json',
            data: 'data',
            success: function(data)
			{
				$("#showTitleTorrents ul").empty();
				$("#showTitleTorrents ul").append('<li data-role=\'list-divider\'>The Pirate Bay torrents</li>');
				for(var x=0; x<5; x++)
				{
				$("#showTitleTorrents ul").append("<li><a onclick=queueMagnet('"+data[x].magnet+"'); href=#queue>"+data[x].name+" - S:"+data[x].seeders+" L:"+data[x].leechers+"</a></li>");
				}
				
				$("#showTitleTorrents ul").listview('refresh');
								console.log("refreshed");
            } 
			
         });
}
function getIMDBSearch(str)
{
	

	if(str!="")
	{
		var feedurl = "http://imdbapi.org/?title="+str+"&type=json&plot=simple&episode=1&limit=5&yg=0&mt=none&lang=en-US&offset=&aka=simple&release=simple&business=0&tech=0";

        jQuery.ajax(
		{
            url: feedurl,
            dataType: 'json',
            data: 'data',
            success: function(data)
			{
				$("#searchIMDBOutput ul").empty();
				for(var x=0; x<5; x++)
				{
				var posterimage="js/bypass.php?image_src="+data[x].poster;
				if(data[x].poster==undefined)
				posterimage="notfound.png";
				$("#searchIMDBOutput ul").append("<li><a onclick=queueTitle('"+data[x].imdb_id+"'); href=#titleReview><img class='ui-li-icon' src='"+posterimage+"'>"+data[x].title+" - "+data[x].year+" "+data[x].type+"<br>"+data[x].plot_simple+"</a></li>");
				$("#searchIMDBOutput ul").listview('refresh');
				} 
			}
         });
	}
}
function queueMagnet(magnet)
{
				console.log(localStorage);
				var magNameFront = magnet.indexOf("&dn=");
				var magNameBack = magnet.indexOf("&tr=", magNameFront);
				var magName = magnet.substr(magNameFront+4, magNameBack);
				magName = magName.replace(/\+/g, " ");
				appendToStorage('queuedMagnets', '<li><a onclick=\'addTorrent()\'>'+magName+'</a></li>');
				console.log(localStorage);
}
function loadMagnets()
{
				console.log("Reading magnets");
				$("#queuedList").empty();
				$("#queuedList").append('<li data-role=\'list-divider\'>queued</li>');

				$("#queuedList").append(localStorage["queuedMagnets"]);
				$("#queuedList").append('<li><a href=\'#queue\' onclick=\'clearQueued()\'><center>Clear Queued List</center></a></li>');
				$("#queuedList").listview('refresh');
}
function appendToStorage(name, data){
				var old = localStorage.getItem(name);
				if(old === null) old = "";
				localStorage.setItem(name, data + old);
}
function clearQueued()
{
	localStorage.setItem("queuedMagnets", "")
	loadMagnets();
}
function queueTitle(imdbID)
{
	console.log(imdbID);
	localStorage.setItem('loadedTitle', imdbID);	
}
function loadTitle()
{
		var feedurl = "http://imdbapi.org/?ids="+localStorage.getItem("loadedTitle")+"&type=json&plot=full&episode=1&limit=1&yg=0&mt=none&lang=en-US&offset=&aka=simple&release=simple&business=0&tech=0";

        jQuery.ajax(
		{
            url: feedurl,
            dataType: 'json',
            data: 'data',
            success: function(data)
			{
				console.log(data);
				var posterimage="js/bypass.php?image_src="+data[0].poster;
				if(data[0].poster==undefined)
				posterimage="notfound.png";
				$("#showIMDBOutput").html("<img style='vertical-align:middle; float:left; padding-right: 25px' src='"+posterimage+"'><span><h1>"+data[0].title+"</h1><br>"+data[0].year+" "+data[0].type+"<br><br>"+data[0].plot+"<br><br><strong>Cast</strong><br>"+data[0].actors[0]+"<br>"+data[0].actors[1]+"<br>"+data[0].actors[2]+"</span><br>");
				console.log("created");
				appendTorrents(data[0].title, "all");

			}
         });
}
function addTorrent()
{
	var btapp = new Btapp();
 	btapp.connect();

	
	var magnet = 'magnet:?xt=urn:btih:f0d665f264393a7dafd7d05d739e1097df652e80&dn=The.Yes.Men.Fix.The.World';
	 
	var callback = function() {
	  alert('added the torrent');
	};
	btapp.get('add').torrent({
	  url: magnet,
	  callback: callback
	});
}