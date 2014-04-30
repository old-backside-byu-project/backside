backfire-app
============

An open-source backend-as-a-service inspired by firebase

# Description
A backend-as-a-service allows you to create rich web apps without having to worry about the overhead of a backend
service. They work great or a lot of use cases with simple persistence needs.

Backfire is an open-source backend-as-a-service that is API compatible with firebase. This means that data is treated as
a tree structure and any path in the tree can be "subscribed" to, which is then updated in real time.

# Architecture
Backfire is built using NodeJS, RabbitMQ, and websockets, which is a good fit for Node's ability to deal with lots of
IO.
Additionally, Backfire is split up into multiple components, each in a separate repo and npm package. This allows for
the various components to be easily used together, or run individually for scale or flexibility.

These components are:

- Persistence Store, in order to store long term state, a persistence store is needed. This is intended to be
  pluggable, but a simple and memory-story and MongoDB are being used for now. TODO: add persistence repo and doc the
  API
- STOMP Proxy, in order to provider a robust real-time messaging API, we use rabbitMQ speaking the STOMP protocol. In
  order to support more robust authentication and authorization, as well as support websockets, a small proxy is used.
  TODO: add in the proxy repo
- HTTP API, the HTTP api is used for retrieving the state as well as publishing
- Client Library, a client library that is API compatible with firebase
- Administrative Frontend, allows for browsing the data as well as providing information about backfire

# Getting Started
This repo contains everything you need to get started with backfire.

## Prerequisites
1. Install RabbitMQ (follow the guide on http://www.rabbitmq.com/download.html)
2. `npm install -g backfire`
3. `backfire`

# Developing
Websockets via socksjs
Testing via mocha - https://github.com/visionmedia/mocha
Dependency Inject via dependable - https://github.com/idottv/dependable

This project contains almost no code, it simply binds together all the different modules using express application mounts

Config is done via environment variables and JSON with sensible defaults, in other words:
```
var port = process.env.PORT || config.port || 3000
```
