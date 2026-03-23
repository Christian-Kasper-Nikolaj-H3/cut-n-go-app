// Import installed modules
import express from 'express';
import cors from 'cors';

// Import local modules
import serverConfig from './config/Server.js';
import { initializeDatabase } from './models/Index.js';

// Import routes
import authRoutes from './routes/auth/Auth.js';
import userRoutes from './routes/api/User.js';

const app = express();
await initializeDatabase();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);

const server = app.listen(serverConfig.port, serverConfig.host, () => {
    console.log(`Server listening on ${serverConfig.host}:${serverConfig.port}`);
});

server.on('error', (err) => {
    console.error(err);
    process.exit(1);
});

['SIGTERM', 'SIGINT'].forEach(signal => {
    process.on(signal, () => {
        server.close((err) => {
            if (err) {
                console.error("Error closing server", err);
            }
            process.exit(err ? 1 : 0);
        })
    });
});