const Redis = process.env.TRAVIS_ENV_TEST
	? require("redis-mock")
	: require("redis");

class RedisPubSub {
	constructor(Options) {
		this.Publisher     = Redis.createClient(Options);
		this.Subscriber    = Redis.createClient(Options);
		this.Subscriptions = {};
		this.Subscriber.on('message', this.onResolve.bind(this));
	}

	publish(Chanel, Message) {
		this.Publisher.publish(Chanel, this.stringifyMessage(Message));
	}

	on(Chanel, Callback) {
		if(this.Subscriptions[Chanel]) {
			this.Subscriptions[Chanel] = [
				... this.Subscriptions[Chanel],
				Callback
			];
		} else {
			this.Subscriptions[Chanel] = [Callback];
			this.Subscriber.subscribe(Chanel);
		}
	}

	unbind(Chanel) {
		this.Subscriber.unsubscribe(Chanel);
		delete this.Subscriptions[Chanel];
	}

	onResolve(Chanel, Message) {
		const Events = this.Subscriptions[Chanel]
			? this.Subscriptions[Chanel] : [];
		for(const Event of Events) {
			Event(this.parseMessage(Message));
		}
	}

	parseMessage(Message) {
		try {
			return JSON.parse(Message);
		} catch (Exception) {
			return Message;
		}
	}

	stringifyMessage(Message) {
		try {
			return JSON.stringify(Message);
		} catch (Exception) {
			return Message.toString();
		}
	}
}

module.exports = RedisPubSub;
