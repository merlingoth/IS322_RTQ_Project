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
				if(localStorage.getItem("ipaddress")=== null)
				localStorage.setItem("ipaddress", "localhost");
				if(localStorage.getItem("port")=== null)
				localStorage.setItem("port", "31337");
				if(localStorage.getItem("username")=== null)
				localStorage.setItem("username", "admin");
				if(localStorage.getItem("password")=== null)
				localStorage.setItem("password", "admin");
	
	
				/*console.log(localStorage);
				var magNameFront = magnet.indexOf("&dn=");
				var magNameBack = magnet.indexOf("&tr=", magNameFront);
				var magName = magnet.substr(magNameFront+4, magNameBack);
				magName = magName.replace(/\+/g, " ");
				appendToStorage('queuedMagnets', '<li><a onclick=\'addTorrent()\'>'+magName+'</a></li>');
				console.log(localStorage);*/
				magnet=encodeURIComponent(magnet);
				var feedurl = "http://"+localStorage["username"]+":"+localStorage["password"]+"@"+localStorage["ipaddress"]+":"+localStorage["port"]+"/gui/?action=add-url&s="+magnet;

				jQuery.ajax(
				{
					type: 'GET',
					crossDomain: true,
					dataType: 'jsonp',
					url: feedurl,
					data: 'data',
					success: function(data)
					{
					console.log("Added!");
					}
				});						
}
function loadMagnets()
{
				if(localStorage.getItem("ipaddress")=== null)
				localStorage.setItem("ipaddress", "localhost");
				if(localStorage.getItem("port")=== null)
				localStorage.setItem("port", "31337");
				if(localStorage.getItem("username")=== null)
				localStorage.setItem("username", "admin");
				if(localStorage.getItem("password")=== null)
				localStorage.setItem("password", "admin");
				console.log("Reading magnets");
				$("#queuedList").empty();
				$("#queuedList").append('<li data-role=\'list-divider\'>downloading</li>');
				$("#queuedList").listview('refresh');
				$("#completedList").empty();
				$("#completedList").append('<li data-role=\'list-divider\'>completed</li>');
				$("#completedList").listview('refresh');
				//$("#queuedList").append(localStorage["queuedMagnets"]);
				//$("#queuedList").append('<li><a href=\'#queue\' onclick=\'clearQueued()\'><center>Clear Queued List</center></a></li>');
				var feedurl = "http://"+localStorage["username"]+":"+localStorage["password"]+"@"+localStorage["ipaddress"]+":"+localStorage["port"]+"/gui/?list=1";

				jQuery.ajax(
				{
					type: 'GET',
					crossDomain: true,
					dataType: 'jsonp',
					url: feedurl,
					data: 'data',
					success: function(data)
					{
						for(var x=0; ;x++)
						{
							if(data.torrents[x]==undefined)
								break;
							else
							{
								if(data.torrents[x][4]==1000)
								{
								$("#completedList").append("<li><div>"+data.torrents[x][2]+" - completed <a onclick=\"actionTorrent('remove', '"+data.torrents[x][0]+"')\" href=#queue><img height='15' width='15' src=delete.png></a></div></li>");
								$("#completedList").listview('refresh');
								}
								else
								{
								var percentage=data.torrents[x][4]/10;
								var left=100-percentage;
								var remaining=Math.floor(data.torrents[x][10]/60);
								var reunit="minute(s)";
								
								if(remaining>60)
								{
									remaining=Math.floor(remaining/60);
									reunit="hour(s)";
									if(remaining>24)
									{
										remaining=Math.floor(remaining/24);
										reunit="day(s)";								
									}
								}
								var torrentName=data.torrents[x][2].substring(0, 45);
								
								$("#queuedList").append("<li><div>"+torrentName+"<br>ETA: about "+remaining+" "+reunit+"<br><img height='10' src='gbar.png' width='"+percentage+"'><img height='10' src='blackbar.png' width='"+left+"'>"+percentage+"%<br><a onclick=\"actionTorrent('start', '"+data.torrents[x][0]+"')\" href=#queue><img src=play.png></a> <a onclick=\"actionTorrent('pause', '"+data.torrents[x][0]+"')\" href=#queue><img src=pause.png></a> <a onclick=\"actionTorrent('stop', '"+data.torrents[x][0]+"')\" href=#queue><img src=stop.png></a> <a onclick=\"actionTorrent('removedata', '"+data.torrents[x][0]+"')\" href=#queue><img src=delete.png></a></div></li>");
								$("#queuedList").listview('refresh');
								}
							}
						}
					}
				});			
}
function appendToStorage(name, data)
{
				var old = localStorage.getItem(name);
				if(old === null) old = "";
				localStorage.setItem(name, data + old);
}
function actionTorrent(action, hash)
{
	console.log("Called");
	if(action=="removedata" || action=="remove")
	{
	  var c=confirm("Are you sure you want to remove this torrent?")
	  if(c==true)
	  {
				var feedurl = "http://"+localStorage["username"]+":"+localStorage["password"]+"@"+localStorage["ipaddress"]+":"+localStorage["port"]+"/gui/?action="+action+"&hash="+hash;

				jQuery.ajax(
				{
					type: 'GET',
					crossDomain: true,
					dataType: 'jsonp',
					url: feedurl,
					data: 'data',
					success: function(data)
					{
					console.log(action + "completed");
					}
				});						
	  }
	  else
	  {
	  }
	}
	else
	{
				var feedurl = "http://"+localStorage["username"]+":"+localStorage["password"]+"@"+localStorage["ipaddress"]+":"+localStorage["port"]+"/gui/?action="+action+"&hash="+hash;

				jQuery.ajax(
				{
					type: 'GET',
					crossDomain: true,
					dataType: 'jsonp',
					url: feedurl,
					data: 'data',
					success: function(data)
					{
					console.log(action + "completed");
					}
				});						
	}
}
function overwriteToStorage(name, data)
{
				localStorage.setItem(name, data);
}
function loadSettings()
{
	if(localStorage.getItem("ipaddress")=== null)
	localStorage.setItem("ipaddress", "localhost");
	if(localStorage.getItem("port")=== null)
	localStorage.setItem("port", "31337");
	if(localStorage.getItem("username")=== null)
	localStorage.setItem("username", "admin");
	if(localStorage.getItem("password")=== null)
	localStorage.setItem("password", "admin");
	
	
	$("#ipaddress_settings").val(localStorage.getItem("ipaddress"));
	$("#port_settings").val(localStorage.getItem("port"));
	$("#username_settings").val(localStorage.getItem("username"));
	$("#password_settings").val(localStorage.getItem("password"));
	console.log("loaded");
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
	var magnet = 'magnet:?xt=urn:btih:f0d665f264393a7dafd7d05d739e1097df652e80&dn=The.Yes.Men.Fix.The.World';
	

}