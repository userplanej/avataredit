import { createServer, Model } from 'miragejs';
import { actors } from './__mock__/actor.json';

export function makeServer({ environment = 'test' } = {}) {
	let server = createServer({
		environment,

		models: {
			actor: Model,
		},

		seeds(server) {
			for (let actor of actors.slice(0, 10)) {
				server.create('actor', actor);
			}
		},

		routes() {
			this.namespace = 'api';

			this.get('/actors', schema => {
				return schema.actors.all();
			});
		},
	});

	return server;
}
