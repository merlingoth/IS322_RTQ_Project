<?php
$opts = array('http' =>
    array(
        'method'  => 'GET',
        'header'  => 'Referer: http://media-imdb.com',
    )
);

$context  = stream_context_create($opts);

header('Content-Type: image/vnd.microsoft.icon');
echo file_get_contents($_GET['image_src'], false, $context);
?>