<?php
// Aplicação de monitoramento de servidores
// Criada por Carlos Madera - Michelin (17/06/2016)

/*
 * - All
 * - Warnings
 * - Inventory
 * - Network
 * - Middleware
 * 
 */
//if (@$_GET["DISPLAY"]==NULL) return;
$display = strtolower(@$_GET["DISPLAY"]);

$MONVERSION = '1.0.12';
$inicioProcessoMonitor = microtime(true); 
$warnings = 0;
$monitor = array();
array_push($monitor, array('name' => "SERVERNAME", 'value' => $_SERVER['SERVER_NAME']));
//array_push($monitor, array('name' => "REMOTENAME", 'value' => gethostbyaddr($_SERVER['REMOTE_ADDR'])));
//array_push($monitor, array('name' => "REMOTEADDR", 'value' => $_SERVER['REMOTE_ADDR']));

if ($display!="network") {
    
    if ($display!="warnings") {
        array_push($monitor, array('name' => "OS Version", 'value' => getOSVersion(), "mu" => ""));
    }
    
    if ($display!="middleware") {
        if ($display!="warnings") {
            array_push($monitor, array('name' => "CPUs", 'value' => getNumCpus(), "mu" => ""));
            array_push($monitor, array('name' => "RAM(Free)", 'value' => floor(getTotalRAM()/1024)."MB (".floor(getFreeRAM()/getTotalRAM()*100)."%)", "mu" => ""));
        }
        // DISKS
        $monitor = array_merge($monitor, getDisks($warnings));
    }
}

$lastUpdate = getLastUpdate(); //if ($lastUpdate>35) {$warnings++;}
if ($display=="all" || $display=="warnings") {
    array_push($monitor, array('name' => "LASTUPDATE", 'value' => $lastUpdate." days".(($lastUpdate>35)?"!":"")));
}
if ($display=="all") {
    array_push($monitor, array('name' => "UPTIME", 'value' => getUptime(), "mu" => "days"));
}
if ($display!="network" && $display!="small" ) {
	$dtSsl = sslValidTo($_SERVER['SERVER_NAME']); //if ($dtSsl=="N/A") {$warnings++;}
	array_push($monitor, array('name' => "SSLEXPIRE", 'value' => $dtSsl, "mu" => ""));
}

if ($display=="all" || $display=="network") {
    array_push($monitor, array('name' => "LATENCY", 'value' => latency($_SERVER['SERVER_NAME']), "mu" => "ms"));
}
if ($display=="all" || $display=="middleware") {
    array_push($monitor, array('name' => "TIMEZONE", 'value' => date_default_timezone_get(), "mu" => ""));
    array_push($monitor, array('name' => "PHPVERSION", 'value' => phpversion(), "mu" => ""));
    array_push($monitor, array('name' => "MYSQLVERSION", 'value' => getMySQLVersion(), "mu" => ""));
    array_push($monitor, array('name' => "MONVERSION", 'value' => $MONVERSION, "mu" => ""));
}

$fimProcessoMonitor = microtime(true); 
$totatime = round((($fimProcessoMonitor - $inicioProcessoMonitor) * 1000), 0);
/*if ($totatime>2000) {$warnings++;}
if ($display=="all" || $display=="warnings") {
    array_push($monitor, array('name' => "WARNINGS", 'value' => ($warnings>0)?$warnings. " WARNING(S)":"NO WARNING", "mu" => ""));
}
*/
if ($display=="all" || $display=="warnings") {
    array_push($monitor, array('name' => "PROC-USAGE", 'value' => $totatime, "mu" => "ms"));
}
echo json_encode($monitor);

//---------------------------------------------------------------------------------------------
// FUNCTIONS
//---------------------------------------------------------------------------------------------
function getOSVersion() {
    $version = "";
    if ('WIN' == strtoupper(substr(PHP_OS, 0, 3))) {
        $version = getWindowsParameter("wmic OS get Caption,OSArchitecture,Version");
    } else {
        // OS 
        $linuxVersion = strtolower(exec("cat /proc/version"));
        $pos = strpos($linuxVersion, "debian") + strpos($linuxVersion, "ubuntu");

        if ($pos == 0) {
            $version = exec("cat /etc/redhat-release");
        } else {
            $version = exec("lsb_release -d -s");
        }
    }
    return $version;
}

function getLastUpdate() {
    if ('WIN' == strtoupper(substr(PHP_OS, 0, 3))) {
        $lastUpdate ="N/I";
    } else {
        // OS 
        $linuxVersion = strtolower(exec("cat /proc/version"));
        $pos = strpos($linuxVersion, "debian") + strpos($linuxVersion, "ubuntu");

        $aptDate = 0;
        if ($pos == 0) {
            $aptDate = exec("stat -c %Y '/var/cache/yum/x86_64/7'");
        } else {
            $aptDate = exec("stat -c %Y '/var/cache/apt'");
        }

        // LASTUPDATE
        //$aptDate = exec("stat -c %Y '/var/cache/apt'");
        $nowDate = exec("date +'%s'");
        $lastUpdate = round(($nowDate - $aptDate)/3600/24);
    }
    return $lastUpdate;
}

function getNumCpus() {
    $numCpus = 1;
    if (is_file('/proc/cpuinfo')) {
        $cpuinfo = file_get_contents('/proc/cpuinfo');
        preg_match_all('/^processor/m', $cpuinfo, $matches);
	exec ("cat /proc/cpuinfo", $details);
	$numCpus = count($matches[0]) . " (" . substr($details[4], 13) . ")";
    } else if ('WIN' == strtoupper(substr(PHP_OS, 0, 3))) {
        $process = @popen('wmic cpu get NumberOfLogicalProcessors', 'rb');
        if (false !== $process) {
            fgets($process);
            $numCpus = intval(fgets($process));
            pclose($process);
        }
    } else {
        $process = @popen('sysctl -a', 'rb');
        if (false !== $process) {
            $output = stream_get_contents($process);
            preg_match('/hw.ncpu: (\d+)/', $output, $matches);
            if ($matches) {
                $numCpus = intval($matches[1][0]);
            }
            pclose($process);
        }
    }

    return $numCpus;
}

function getCpuUsage() {
    $exec_loads = sys_getloadavg();
    $exec_cores = trim(shell_exec("grep -P '^processor' /proc/cpuinfo|wc -l"));
    return round($exec_loads[1]/($exec_cores + 1)*100, 0) . '%';    
}

function getFreeRAM() {
    return getRAM('wmic os get FreeVirtualMemory', "MemFree");
}

function getTotalRAM() {
    return getRAM('wmic computersystem get TotalPhysicalMemory', "MemTotal");
}

function getRAM($wincmd, $lincmd) {
    $ram = "0";
    if ('WIN' == strtoupper(substr(PHP_OS, 0, 3))) {
        $process = @popen($wincmd, 'rb');
        if (false !== $process) {
            fgets($process);
            $ram = fgets($process)/($lincmd=="MemFree"?1:1024);
            pclose($process);
        }
    } else {
        $data = explode("\n", file_get_contents("/proc/meminfo"));
        foreach ($data as $line) {
            list($key, $val) = explode(":", $line);
            $pieces = explode(" k", $val);
            if ($key==$lincmd) {
                $ram = $pieces[0];
            }
        }
    }    
    return $ram;
}

function getDisks(&$warnings) {
    $disk = array();
    if ('WIN' == strtoupper(substr(PHP_OS, 0, 3))) {
        $command = "wmic logicaldisk get caption";
        exec("$command", $output); 
        foreach ($output as $line) {
            if ($line!="caption") {
                $ds = @floor(disk_total_space($line)/(1000*1024*1024)); 
                if ($ds>0) {
                    $df = @floor(disk_free_space($line)/(1000*1024*1024));
                    if (($df/$ds)*100<10) { $warnings++; }
                   	array_push($disk, array('name' => "DISK ".$line."(Free)", 'value' => $ds."GB (".floor(($df/$ds)*100).(($df/$ds)*100<10?"!":"")."%)", "mu" => ""));
                }
            }
        }
    } else {
        $command = "findmnt -lo target -t ext3,ext4,cifs";
        exec("$command", $output); 
        $i = 0;
        foreach ($output as $line) {
            if ($line!="TARGET") {
                $ds = floor(disk_total_space($line)/(1000*1024*1024));
                if ($ds>3 && $ds<1000) {
                    $i++;
                    $df = floor(disk_free_space($line)/(1000*1024*1024));
                    if (($df/$ds)*100<10) { $warnings++; }
                   	array_push($disk, array('name' => "DISK".$i."(Free)", 'value' => $ds."GB (".floor(($df/$ds)*100).(($df/$ds)*100<10?"!":"")."%)", "mu" => ""));
                }
            }
        }
    }
    return $disk;
}

function getUptime() {
    $uptime = "";
    if ('WIN' == strtoupper(substr(PHP_OS, 0, 3))) {
        $uptime = getWindowsParameter('wmic os get lastbootuptime');
        if ($uptime !== "") {
            $uptime = new DateTime(substr($uptime,0,4)."-".substr($uptime,4,2)."-".substr($uptime,6,2));
            $uptime = date_diff(new DateTime("now"), $uptime) ->format( '%a days, %h:%i');
        }
    } else {
        $data = shell_exec('uptime');
        $uptime = explode(' up ', $data);
        $uptime = explode(',', $uptime[1]);
        $uptime = $uptime[0].', '.$uptime[1];
    }
    return $uptime;
}

function sslValidTo($host) { 
    //$orignal_parse = $_SERVER['SERVER_NAME']; //parse_url($url, PHP_URL_HOST);
    $get = stream_context_create(array("ssl" => array("capture_peer_cert" => TRUE)));
    $read = @stream_socket_client("ssl://".$host.":443", $errno, $errstr, 30, STREAM_CLIENT_CONNECT, $get);
    $cert = @stream_context_get_params($read);
    $certinfo = openssl_x509_parse($cert['options']['ssl']['peer_certificate']);
    $validTo = $certinfo['validTo'];
    if ($validTo!="") {
        $validTo = "20".substr($validTo,0,2)."-".substr($validTo,2,2)."-".substr($validTo,4,2);
//        array_push($monitor, array('name' => "SSLEXPIRE", 'value' => "20".substr($validTo,0,2)."-".substr($validTo,2,2)."-".substr($validTo,4,2)));
    } else {
        $validTo = "N/A";
    }
    return $validTo;
}

function latency($host) { 
  $tB = microtime(true); 
  $fP = fSockOpen($host, 80); //, $errno, $errstr, $timeout); 
  if (!is_resource($fP)) { return "down".$host; } else { fclose($fP);}
  $tA = microtime(true); 
  return round((($tA - $tB) * 1000), 0); 
}

function getWindowsParameter($param) {
    $response = "";
    $process = @popen($param, 'rb');
    if (false !== $process) {
        fgets($process);
        $response = fgets($process);
        pclose($process);
    }
    return $response;
}

function getMySQLVersion() {
    $result = "N/A";
    if (extension_loaded('mysql')) {
    	if ('WIN' == strtoupper(substr(PHP_OS, 0, 3))) {
    		$output = shell_exec('C:\xampp\mysql\bin\mysql -V'); 
    	} else {
			$output = shell_exec('mysql -V'); 
    	}
		preg_match('@[0-9]+\.[0-9]+\.[0-9]+@', $output, $version); 
		$result = $version[0]; 
    } 
    return $result;
}
