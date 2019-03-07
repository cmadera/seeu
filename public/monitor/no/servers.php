<?php
// Aplicação de monitoramento de servidores
// Criada por Carlos Madera - Michelin (17/06/2016)


$servers = array();

array_push($servers, array('nome' => "DEV",				'url' => "dev.bigbank.com.br",  		'agent' => "/monitor.php", 'protocol' => "http"));
array_push($servers, array('nome' => "eSSe",            'url' => "www.esseregalos.com",         'agent' => "/monitor.php", 'protocol' => "http"));
array_push($servers, array('nome' => "Utopias",         'url' => "utopiasargentinas.com",       'agent' => "/monitor.php", 'protocol' => "http"));

echo json_encode($servers);


//echo file_get_contents('https://bigbank.com.br/servers.txt');
?>
