var _ = require("lodash")
var path = require("path")
// manages the config file
var defaultConfig = {
  ports: {
    ws: 5000,
    tcp: 5001,
    api: 5010
  },
  proxy: {
    STOMP_USERNAME: "guest",
    STOMP_PASSWORD: "guest",
    STOMP_EXCHANGE: "backside",
    SOCK_PREFIX: "/socks"
  },
  api: {
    SESSION_SECRET: "default"
  },
  store: {
    name: "memory",
    config: {}
  },
  messenger: {
    name: "amqp",
    config: {}
  },
  auth: {
    name: "userpass",
    config: {}
  },
  security: {
    name: "ruletree",
    config: {}
  }
}

var config = defaultConfig
var configFile = process.argv[2]

if (configFile) {
  config = _.defaults(require(path.join(process.cwd(), configFile)), defaultConfig)
}

module.exports = {
  configure: function(container) {
    var ports = config.ports
    delete config.ports
    var proxy = config.proxy
    delete config.proxy
    for (var key in proxy) {
      container.register(key, proxy[key])
    }
    var api = config.api
    delete config.api
    for (var key in api) {
      container.register(key, api[key])
    }
    for (var key in config) {
      var modules = moduleInits[key]
      if (!modules) throw new Error("Unknown key " + key + " in config")
      var moduleName = config[key].name
      var moduleConfig = config[key].config || {}
      var initFunc = modules[moduleName]
      if (!initFunc) throw new Error("Unknown " + key + ": " + moduleName)

      container.register(key, initFunc(moduleConfig))
    }
    return ports
  }
}

var moduleInits = {
  store: {
    "memory": function() {
      var MemS = require("backside-memory-store")
      return function() {
        return new MemS()
      }
    },
    "mongodb": function(config) {
      var MongoS = require("backside-mongo-store")
      return function() {
        return new MongoS(config.url, config)
      }
    }
  },
  messenger: {
    "amqp": function(config) {
      var AmqpM = require("backside-amqp-messenger")
      return function() {
        return new AmqpM(config.url, config)
      }
    }
  },
  auth: {
    "userpass": function(config, persistence) {
      var UserA = require("backside-userpass-auth")
      return function(persistence) {
        return new UserA(persistence, config)
      }
    },
    "token" : function(config) {
      var TokenA = require("backside-token-auth")
      return function() {
        return new TokenA(config)
      }
    }
  },
  security: {
    "ruletree": function(config) {
      var RuleSec = require("backside-ruletree-security")
      return function(persistence, logger) {
        config.logger = logger
        return new RuleSec(persistence, config)
      }
    }
  }
}
