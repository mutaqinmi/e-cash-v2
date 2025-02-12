import readline from 'readline';
import pg from 'pg';
import { exec } from 'node:child_process';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = async (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
};

const databaseURL = "postgres://postgres:postgres@localhost:5432/postgres";
const client = new pg.Client({ connectionString: databaseURL });

const main = async () => {
    try {
        await client.connect();

        const checkDatabase = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', ['ecash']);

        if (checkDatabase.rowCount === 0) {
            const confirmCreation = await question('Database ecash does not exist. Do you want to create it? (y/n) ');

            if (confirmCreation.toLowerCase() !== 'y') {
                console.log('Database creation cancelled');
                close();
            }

            await client.query('CREATE DATABASE ecash');
            console.log('Database created successfully');

            await generate();
            await migrate();

            close();
        } else {
            console.log('Database ecash already exists, skipped creation');

            await generate();
            await migrate();

            close();
        }
    } catch (error) {
        console.log('Error connecting to database\n', error);
    }
};

main();

async function generate() {
    try {
        await new Promise((resolve, reject) => {
            exec('pnpm db:generate', (error, stdout, stderr) => {
                if (error) {
                    console.log("Error generating database\n", error);
                    reject(error);
                } else {
                    console.log(stdout);
                    resolve(stdout);
                }
            });
        });
    } catch (error) {
        console.log("Error generating database\n", error);
    }
}

async function migrate() {
    try {
        await new Promise((resolve, reject) => {
            exec('pnpm db:migrate', (error, stdout, stderr) => {
                if (error) {
                    console.log("Error migrating database\n", error);
                    reject(error);
                } else {
                    console.log(stdout);
                    resolve(stdout);
                }
            });
        });
    } catch (error) {
        console.log("Error migrating database\n", error);
    }
}

function close(){
    rl.close();
    client.end();
    process.exit(0);
}