import helmet from 'helmet';
import bodyParser from 'body-parser';
import contentFilter from 'content-filter';
import passport from 'passport';
import express from 'express';

// API Route/enpoint controllers
import {
    loadStrategies,
    createAccount,
    updateAccount,
    deleteAccount,
    authenticate,
    onAuthSuccess,
} from './authentication';

/**
 * Setup the API endpoints
 * @param  {HTTP/S}  webserver The HTTP/s webserver
 * @param  {Express} app       Express app
 */
export default function(app, config) {
    app.set('config', config);
    app.use(bodyParser.json());
    app.use(helmet());
    app.use(passport.initialize());
    app.use(bodyParser.urlencoded({
        extended: true,
    }));
    app.use(contentFilter({
        methodList: ['GET', 'POST'],
    }));

    // Set needed headers for the application.
    app.use(function(req, res, next) {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'Accept, X-Requested-With, Content-Type');
        // Whether requests needs to include cookies in the requests sent to the API. We shouldn't use this unless we retained sessions etc. which we don't!
        res.setHeader('Access-Control-Allow-Credentials', false);
        // Pass to next middleware
        next();
    });

    // load all authentication strategies
    loadStrategies(passport);

    // setup API routes
    // eslint-disable-next-line
    const routes = express.Router({
        caseSensitive: false,
    });

    routes.route('/account')
        .post(createAccount);

    routes.route('/account/:userId')
        .delete(deleteAccount)
        .patch(updateAccount);

    // user/password authentication
    routes.route('/auth')
        .post(authenticate, onAuthSuccess);

    // OAuth
    routes.route('/auth/:provider')
        .get(authenticate);

    // OAuth callbacks
    routes.route('/auth/:provider/callback')
        .get(authenticate, onAuthSuccess);

    // register the routes to the /api prefix
    app.use('/api', routes);

    // listen on port 80
    app.listen(config.api.port);
    console.log(`API listening on port ${config.api.port}`);
};
