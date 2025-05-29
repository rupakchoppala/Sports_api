"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const PORT = 5000;
const API_URL = 'https://www.thesportsdb.com/api/v2/examples/full_league_season_schedule.json';
app.use((0, cors_1.default)());
app.get('/api/schedule', async (_req, res) => {
    try {
        const response = await axios_1.default.get(API_URL);
        res.json(response.data);
    }
    catch (error) {
        console.error('Error in /api/schedule:', error.message);
        res.status(500).json({ message: 'Failed to fetch schedule data', error: error.message });
    }
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
