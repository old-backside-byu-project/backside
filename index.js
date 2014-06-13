var stompServer = require("blackcatmq")
var BacksideProxy = require("backside-proxy")
var MemoryStore = require("backside-memory-store")
var container = BacksideProxy.getContainer()

container.register("store", function() {
  return new MemoryStore()
  console.log("stuff", MemoryStore)
  return store
})

var WS_PORT = container.get("WS_PORT")
var TCP_PORT = container.get("TCP_PORT")
var API_PORT = container.get("API_PORT")

var proxyServers = BacksideProxy.createServers()
var apiServer = container.get("server")

proxyServers.ws.listen(WS_PORT, function() {
  console.log("started stomp websocket proxy on port " + WS_PORT)
})
proxyServers.tcp.listen(TCP_PORT, function() {
  console.log("started stomp tcp proxy on port " + TCP_PORT)
})
apiServer.listen(API_PORT, function() {
  console.log("started api on port " + API_PORT)
})





