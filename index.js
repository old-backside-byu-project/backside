var stompServer = require("blackcatmq")
var BacksideProxy = require("backside-proxy")
var container = BacksideProxy.getContainer()

var ports = require("./configBuilder").configure(container)

var proxyServers = BacksideProxy.createServers()
var apiServer = container.get("server")

proxyServers.ws.listen(ports.ws, function() {
  console.log("started stomp websocket proxy on port " + ports.ws)
})
proxyServers.tcp.listen(ports.tcp, function() {
  console.log("started stomp tcp proxy on port " + ports.tcp)
})
apiServer.listen(ports.api, function() {
  console.log("started api on port " + ports.api)
})

