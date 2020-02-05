# Usage of RedisPubSub to Events

[![NPM version](https://img.shields.io/npm/v/redis-pubsub-manager.svg)](https://npmjs.org/package/redis-pubsub-manager)
[![Downloads](https://img.shields.io/npm/dm/redis-pubsub-manager.svg)](https://npmjs.org/package/redis-pubsub-manager)
[![Build Status](https://travis-ci.org/wilmerhmg/redis-pub-sub-manager.svg?branch=master)](https://travis-ci.org/wilmerhmg/redis-pub-sub-manager)
[![Coverage Status](https://coveralls.io/repos/github/wilmerhmg/redis-pub-sub-manager/badge.svg?branch=master)](https://coveralls.io/github/wilmerhmg/redis-pub-sub-manager?branch=master)

This is a small library, convert callback Subscriptions to events


## Installation

````
npm i redis-pub-sub-manager
````
or
```
npm i -D redis-pub-sub-manager
```

## Example

### Using native implementation of redis library
Traditionally when subscribing an event when a message arrives we have 2 variables, the channel and the message. So we must always ask for the channel before executing a specific action for that channel.

So we must add a couple of additional lines in our code and we can only send flat messages; so we must encode and decode when sending and receiving a message.

We must also create a connection to publish and another to subscribe.
```js
const Redis = require('redis');
const Publisher  = Redis.createClient(...optionsOfRedis); //View  https://www.npmjs.com/package/redis#rediscreateclient
const Subscriber = Redis.createClient(...optionsOfRedis); //View https://www.npmjs.com/package/redis#rediscreateclient

//To listen a event
Subscriber.subscribe("AEventName");
Subscriber.on('message',(Chanel, PlainMessage) => {
    if(Chanel==="AEventName"){
        //Any action
        console.log(JSON.parse(PlainMessage));
    }
});

//To publish
Publisher.publish('AEventName',JSON.stringify({Other:15, Msg:'Hello World!'}));

//To stop receive messages
Subscriber.unsubscribe("AEventName");
```
---
### Using this library
Custom events, multiple callbacks for the same event, supports flat messages and objects.

You write less code.
```js
const RedisPubSub = require('redis-pubsub-manager');
const redisPubSub = new RedisPubSub(...optionsOfRedis); //View https://www.npmjs.com/package/redis#rediscreateclient

//Add bind action to event
redisPubSub.on("AEventName",(Message)=>{
    console.log(Message); //Object or String
});

//To publish
redisPubSub.publish("AEventName",{Other:15, Msg:'Hello World!'});

//To stop receive messages
redisPubSub.unbind("AEventName");
```
