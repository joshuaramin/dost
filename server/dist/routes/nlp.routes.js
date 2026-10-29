"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nlp_controller_1 = require("../controller/nlp.controller.js");
const express_1 = tslib_1.__importDefault(require("express"));
const router = express_1.default.Router();
router.get("/", nlp_controller_1.getAllHeatMapGeo);
exports.default = router;
