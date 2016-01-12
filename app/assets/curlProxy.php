<?php
/**
 * Created by IntelliJ IDEA.
 * User: jebbie
 * Date: 12/01/16
 * Time: 20:12
 */

// enable CORS for everyone
header("Access-Control-Allow-Origin: *");

$url = $_GET['url'];

$ch = curl_init();
$timeout = 5;
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
$data = curl_exec($ch);
curl_close($ch);

echo $data;
