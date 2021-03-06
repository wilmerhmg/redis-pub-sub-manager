const RedisPubSub = require('../RedisPubSub');

describe('RedisPubSub Testing', function () {
	const EventName   = 'Challenge.Test';
	const redisPubSub = new RedisPubSub({
		host: 'localhost',
		port: 32769,
		retry_unfulfilled_commands: true
	});

	it('should instance of RedisPubSub', function () {
		expect(redisPubSub).toBeInstanceOf(RedisPubSub);
	});

	it('should subscribe to Challenge.Test', function () {
		redisPubSub.on(EventName, (Message) => {
			console.log(Message);
		});
		expect(redisPubSub.Subscriptions[EventName]).toBeDefined();
		expect(typeof redisPubSub.Subscriptions[EventName]).toBe("object");
		expect(typeof redisPubSub.Subscriptions[EventName][0]).toBe("function");
	});

	it('should unbind subscription Challenge.Test', function () {
		redisPubSub.unbind(EventName);
		expect(redisPubSub.Subscriptions[EventName]).not.toBeDefined();
	});

	it('should execute a specific event', async function () {
		const EventPromise = new Promise(function (resolve, reject) {
			redisPubSub.on(EventName, (Message) => {
				resolve(expect(Message).toBe("Hello! World"));
			});
		});

		const EmitterOne = new Promise(function (resolve, reject) {
			setTimeout(() => {
				redisPubSub.publish("OtherEvent", "Hello! People");
				resolve(false);
			}, 100);
		});

		const EmitterTwo = new Promise(function (resolve, reject) {
			setTimeout(() => {
				redisPubSub.publish(EventName, "Hello! World");
				resolve(true);
			}, 400);
		});

		await Promise.all([EmitterOne, EmitterTwo, EventPromise]);
	});

	it('should execute multiple events an one instance', async function () {
		const EventPromise      = new Promise(function (resolve, reject) {
			redisPubSub.on(EventName, (Message) => {
				resolve(expect(Message).toBe("Hello! World"));
			});
		});
		const OtherEventPromise = new Promise(function (resolve, reject) {
			redisPubSub.on("OtherEvent", (Message) => {
				resolve(expect(Message).toBe("Hello! People"));
			});
		});

		const EmitterOne = new Promise(function (resolve, reject) {
			setTimeout(() => {
				redisPubSub.publish("OtherEvent", "Hello! People");
				resolve(false);
			}, 100);
		});

		const EmitterTwo = new Promise(function (resolve, reject) {
			setTimeout(() => {
				redisPubSub.publish(EventName, "Hello! World");
				resolve(true);
			}, 100);
		});

		await Promise.all([EmitterOne, EmitterTwo, EventPromise, OtherEventPromise]);
	});

	it('should unbind all subscriptions', function () {
		redisPubSub.unbindAll();
		expect(Object.keys(redisPubSub.Subscriptions).length).toBe(0);
	});

	it('should return a string by catch exception in parseMessage', function () {
		const BadJsonString = "{a:Hello! World}";
		expect(typeof redisPubSub.parseMessage(BadJsonString)).toBe('string');
		expect(redisPubSub.parseMessage("{a:Hello! World}")).toBe(BadJsonString);
	});

});
