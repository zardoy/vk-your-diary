import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { Client } from "pg";
//@ts-ignore
import * as pgtools from "pgtools";
import urlParse from "url-parse";

dotenv.config({
    path: path.resolve(__dirname, "../prisma/.env")
});

(async () => {
    if (!process.env.DATABASE_URL)
        throw new TypeError(`DATABASE_URL env is not defined! Please check .env file in prisma folder!`);
    const dbURLConfig = urlParse(process.env.DATABASE_URL);
    const DATABASE_NAME = dbURLConfig.pathname.slice(1);

    const basicDbConfig = {
        host: dbURLConfig.hostname,
        port: +dbURLConfig.port,
        user: dbURLConfig.username,
        password: dbURLConfig.password
    };

    console.log(`Reseting db...`);
    // DROP DB START
    try {
        await pgtools.dropdb(basicDbConfig, DATABASE_NAME);
    } catch (err) {
        if (!(err instanceof Error)) throw err;
        if (!/Cause: database "[A-z0-9]+" does not exist/i.test(err.message)) throw err;
    }
    // DROP DB END
    await pgtools.createdb(basicDbConfig, DATABASE_NAME);

    const pgClient = new Client({
        ...basicDbConfig,
        database: DATABASE_NAME
    });
    await pgClient.connect();
    await pgClient.query(
        (await fs.promises.readFile(
            path.join(__dirname, "../schema.sql")
        )).toString()
    );
    await pgClient.end();
})();