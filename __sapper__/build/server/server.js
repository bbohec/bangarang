'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var sirv_1 = tslib_1.__importDefault(require("sirv"));
var polka_1 = tslib_1.__importDefault(require("polka"));
var compression_1 = tslib_1.__importDefault(require("compression"));
var sapper = tslib_1.__importStar(require("@sapper/server"));
var _a = process.env, PORT = _a.PORT, NODE_ENV = _a.NODE_ENV;
var dev = NODE_ENV === 'development';
exports.default = polka_1.default() // You can also use Express
    .use(compression_1.default({ threshold: 0 }), sirv_1.default('static', { dev: dev }), sapper.middleware())
    .listen(PORT, function (err) {
    if (err)
        console.log('error', err);
});
