var stompServer = require("blackcatmq")

var confFile = process.argv[2]
var conf = {
  STOMP_HOST: process.env["STOMP_HOST"] || "localhost",
  STOMP_PORT: process.env["STOMP_PORT"] || 61613,

}

if (confFile) {
  conf = JSON.parse(fs.readFileSync(confFile))
}
var api = require("backside-api")(conf)
var proxy = require("backside-proxy")(conf)

var proxyServers = proxy.createServers()

stompServer.create(


