import { createServer, Model } from 'miragejs';
import { actors } from './__mock__/actor.json';
import { slides } from './__mock__/slide.json';
export function makeServer({ environment = 'test' } = {}) {
	let server = createServer({
		environment,

		models: {
			actor: Model,
			slide: Model
		},

		seeds(server) {
			for (let actor of actors.slice(0, 10)) {
				server.create('actor', actor);
			}
			for (let slide of slides.slice(0, 10)) {
				server.create('slide', slide);
			}
		},

		routes() {
			this.namespace = 'api';

			this.get('/actors', schema => {
				return schema.actors.all();
			});
			this.get('/slides', schema => {
				return schema.slides.all();
			});
		},
	});

	return server;
}
