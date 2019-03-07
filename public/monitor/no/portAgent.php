<?php

echo header('Access-Control-Allow-Origin: *');
$monitor = array();

$host = $_GET["HOST"];
$ports = array(21, 25, 81, 110, 3306);

foreach ($ports as $port)
{
    $connection = @fsockopen($host, $port);

    if (is_resource($connection))  {
        array_push($monitor, ['name' => $port, 'value' => 'WARNING']);
        fclose($connection);
    } /* else  {
        array_push($monitor, ['name' => $port, 'value' => 'OK']);
    }*/
}

$ports = array(80, 443);

foreach ($ports as $port)
{
    $connection = @fsockopen($host, $port);

    if (!is_resource($connection))  {
        array_push($monitor, ['name' => $port, 'value' => 'WARNING']);
    }
}

echo json_encode($monitor);
