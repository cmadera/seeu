
const os = require('os');

exports.arch = function () {
    return os.arch();
};

exports.cpus = function () {
    var cpus = os.cpus();
    return cpus.length;
}

exports.freemem = function () {
    return os.freemem();
};

exports.platform = function () {
    return os.platform();
};

exports.totalmem = function () {
    return os.totalmem();
};

exports.uptime = function () {
    return os.uptime();
};

exports.result = function () {
    return "platform: " + os.platform() + 
        ", uptime: (s)" + os.uptime() + 
        ", arch: " + os.arch() + 
        ", freemem: " + os.freemem() + 
        ", totalmem: " + os.totalmem() +
        ", type:" + os.type() +
        ", CPUs:" + os.cpus().length;
};


/*
arch()	Returns the operating system CPU architecture
constants	Returns an object containing the operating system's constants for process signals, error cotes etc.
cpus()	Returns an array containing information about the computer's CPUs
endiannes()	Returns the endianness of the CPU
EOL	Returns the end-of-line marker for the current operating system
freemem()	Returns the number of free memory of the system
hostname()	Returns the hostname of the operating system
loadavg()	Returns an array containing the load averages, (1, 5, and 15 minutes)
networkInterfaces()	Returns the network interfaces that has a network address
platform()	Returns information about the operating system's platform
release()	Returns information about the operating system's release
tmpdir()	Returns the operating system's default directory for temporary files
totalmem()	Returns the number of total memory of the system
type()	Returns the name of the operating system
uptime()	Returns the uptime of the operating system, in seconds
userInfo()	Returns information about the current user
*/