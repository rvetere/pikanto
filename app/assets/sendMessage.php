<?php
/**
 * Created by IntelliJ IDEA.
 * User: jebbie
 * Date: 30/11/15
 * Time: 21:48
 */

header("Access-Control-Allow-Headers: accept, content-type");
header("Access-Control-Allow-Method: POST");
header("Access-Control-Allow-Origin: *");

$rawData = $GLOBALS['HTTP_RAW_POST_DATA'];
if (!empty($rawData)) {
    $data = json_decode($rawData, true);

    $to      = 'remo.vetere@gmail.com';
    $subject = 'pikanto.ch - Kontaktformular';
    $message = 'Name: <strong>'.$data['name'].'</strong><br/><br/>'.
    'E-Mail: <strong>'.$data['email'].'</strong><br/><br/>'.
    'Nachricht: '.$data['content'];

    $headers = 'From: hello@pikanto.ch' . "\r\n" .
        'Reply-To: hello@pikanto.ch' . "\r\n" .
        'X-Mailer: PHP/' . phpversion();

    $success = mail($to, $subject, $message, $headers);

    echo '{ "success": '.($success ? "true" : "false")."}";
}


?>

