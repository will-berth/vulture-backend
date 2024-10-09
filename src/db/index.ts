import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from "dotenv";
dotenv.config();

let dbInstance: ReturnType<typeof drizzle> | null = null;

function getDbInstance() {
    if(!dbInstance) {
        const queryClient = postgres(process.env.DB_CONNECTION as string, {
            max: 15,
        });

        dbInstance = drizzle(queryClient);
        return dbInstance;
    }
}

export const db = getDbInstance();