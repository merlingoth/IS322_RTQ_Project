function getSearch(str)
{
	if(str!="")
	{
		var feedurl = "http://apify.ifc0nfig.com/tpb/search?id="+str+"&$top=10";

        jQuery.ajax(
		{
            url: feedurl,
            dataType: 'json',
            data: 'data',
            success: function(data)
			{
				$("#searchOutput ul").empty();
				for(var x=0; x<10; x++)
				{
				$("#searchOutput ul").append("<li><a onclick=queueMagnet('"+data[x].magnet+"'); href=#queue>"+data[x].name+" - S:"+data[x].seeders+" L:"+data[x].leechers+"</a></li>");
				$("#searchOutput ul").listview('refresh');
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
				appendToStorage('queuedMagnets', '<li><a href='+magnet+' onclick=\'addTorrent()\'>'+magName+'</a></li>');
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

function addTorrent()
{
  alert('added the torrent');
}