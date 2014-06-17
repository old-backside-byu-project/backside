backside
============

An open-source backend-as-a-service inspired by firebase

# Quickstart
0. Install RabbitMQ (follow the guide on http://www.rabbitmq.com/download.html) and node.js (http://nodejs.org/)
1. Run `npm install -g backside`
2. Run `backside`
3. TODO: need a demo :)

# Description
A backend-as-a-service allows you to create rich web apps without having to worry about the overhead of a custom backend
service. Backside provides APIs for syncing state in real-time between clients, persisting this state, authorizing access to the data,
and providing authentication. Backside is for more than just the web however, any device or platform that can communicate over TCP
can implement the backside protocol (built on top of STOMP) and seamlessly interact with web clients or other devices.

We hope to get backside to feature and (loose) API parity with Firebase, allowing you to seamlessly switch implementations.
While we love firebase, the ability to control the data, integrate it with existing services, and use the API real-time APIs
across more platforms is the primary motivation for this project.

## Data Model
Like Firebase, Backside models data as a single hierarchal tree. Every 'path' in this tree can be treated like
a pub/sub channel, where updates for that path, and any changes below that path, are sent to the client.

When a client subscribes to a path, they get sent the initial state by the backside service and then also receive
the future updates for that key or under that tree.

For example:
```JavaScript
/* assume the initial state is like so:
{
  "users: {
    "bob" : {
      "age" : 74
    },
    "tim" : {
      "age" : 18
    }
  }
}
*/
// we can subscribe to any changes:
backside.on("/users/bob", function(data) {
  // first get initial data -> {age: 74}
  // after the other client updates the state -> {age: 74, hairColor: "gray"}
  console.log(data)
})

// on another client
backside.child('users').child('bob').child('hairColor').set("gray")
```

## Docs
The docs for the various components are found below:

- JS Library: https://github.com/backside/backside-client _WIP_
- HTTP API: https://github.com/backside/backside-api/wiki/HTTP-API-Docs
- STOMP Message Format: https://github.com/backside/backside-proxy/wiki/Stomp-Message-Format


## Architecture
Backside is built using NodeJS and is composed of a few different projects. Currently, it uses MongoDB to store state,
RabbitMQ to pass and route messages, and connects clients via websockets, TCP sockets, or HTTP.

However, each of these components, such as the data-store, can be implemented and injected into the backside project, allowing
you to use whatever database or message broker you like.

#### Protocol
While backside has an HTTP API, the primary interface is over a websocket (or TCP socket) and uses the STOMP protocol
to communicate between the client and the server. This allows for easier real-time communication and is robust enough protocol
to describe the operations needed in backside.

### Primary Components
Backside has three primary components, which can be run individually or in the same process.

#### Backside (this project!)
The backside project is a convenience project that ties together all the other bits and pieces and allows for central configuration
of the different components. It contains no real code.

#### Backside-api
The backside-api is the core of the project and glues together the different sub-components. It also houses the HTTP
API.

https://github.com/backside/backside-api

#### Backside-proxy
The backside-proxy is what real-time clients connect to. It implements a custom STOMP proxy which provides custom
authentication, rewrites messages, and takes care of writes.

It depends on the backside-api.
- https://github.com/backside/backside-proxy

### Subcomponents
The backside-api is composed of 4 primary sub-components, each one of these sub-components implements an interface
and allows for different implementations to be used seamlessly.

#### Store
The backside store is responsible for providing persistence for the state. The api provides both a public namespace
and private namespace (for storing data not intended for clients, such as password hashes).

See:
- https://github.com/backside/backside-mongo-store - store data in mongo, which each value in its own document
- https://github.com/backside/backside-memory-store - store data in memory (don't use this in prod!)

#### Security
The security sub-component implements a simple API, allowing for conditional reads and writes to the tree.

See:
- https://github.com/backside/backside-ruletree-security - implements a Firebase like tree of rules the reflect the actual tree
of data. Rules are written in a javascript like DSL that allow for conditional access and validation.

#### Auth
The auth module implements mechanisms for login and authentication.

See:
- https://github.com/backside/backside-userpass-auth - implements username/password auth, as well as API tokens and other user state
to be stored.
- https://github.com/backside/backside-token-auth - implements JWT token scheme that is similar to firebase

#### Messenger
The interface sends notifications for updates to the upstream message broker.

See:
- https://github.com/backside/backside-amqp-messenger
Additionally, backside is split up into multiple components, each in a separate repo and npm package. This allows for
the various components to be easily used together, or run individually for scale or flexibility.



# Configuration
*Note: to run backside-api and backside-proxy in seperate process or to use custom components, see this wiki page: TODO: make the wiki page*

Backside is configured via json.

See [dev_example_config.json](dev_example_config.json) and [prod_example_config.json](prod_example_config.json) for examples
of configuration.

Advanced configuration, as well as configuration via environment variables, is also available. See the individual components (listed above)
for the exact options and details

# License
MIT

# Contributing and Bug Reports
1. Open an issue
2. Make a feature branch
3. Open a PR :)

For more info on the architecture see this wiki page: TODO: more wiki
