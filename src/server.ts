import 'dotenv/config';
import App from './app';
import CatRoute from './routes/Cat.route';

(async () => {
    const app = new App([new CatRoute()]);
    await app.initializeApp();
    await app.listen();
})();
