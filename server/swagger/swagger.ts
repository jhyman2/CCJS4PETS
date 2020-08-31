import { getPets } from './pets.swagger';

export const swaggerDocument = {
    openapi: '3.0.1',
    info: {
        version: '1.0.0',
        title: 'APIs Document',
        description: 'your description here',
        termsOfService: 'http://example.com/terms/',
        contact: {
            name: 'Jamison Hyman',
            email: 'jamison.hyman@gmail.com',
            url: 'https://github.com/jhyman2/'
        },
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
        }
    },
    paths: {
        "/pets": {
            "get": getPets
        }
    }
}