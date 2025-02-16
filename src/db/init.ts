import readline from 'readline';
import pg from 'pg';
import { exec } from 'node:child_process';
import argon2 from 'argon2';

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

            await createNewAdministrator();
            close();
        } else {
            console.log('Database ecash already exists, skipped creation');

            await createNewAdministrator();
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

async function createNewAdministrator(){
    const databaseURL = "postgres://postgres:postgres@localhost:5432/ecash";
    const ecash = new pg.Client({ connectionString: databaseURL });

    try {
        await ecash.connect();

        const checkAdministrator = await ecash.query('SELECT * FROM employee');

        if(checkAdministrator.rowCount === 0){
            const confirmCreation = await question('No administrator found. Do you want to create one? (y/n) ');

            if(confirmCreation.toLowerCase() !== 'y'){
                console.log('Administrator creation cancelled');
                ecash.end();
            }

            const full_name = await question('Administrator full name: ');
            const user_name = await question('Administrator username: ');
            const password = await question('Administrator password: ');
            const role = 'Administrator';

            const hashed_password = await argon2.hash(password, {
                type: argon2.argon2id,
                memoryCost: 2 ** 16,
                timeCost: 3,
                parallelism: 1
            });

            await ecash.query('INSERT INTO employee(full_name, user_name, password, role) VALUES ($1, $2, $3, $4)', [full_name, user_name, hashed_password, role]);
            console.log('Administrator created successfully!');

            ecash.end();
        } else  {
            console.log('Administrator creation skipped, already exists');
            ecash.end();
        }
    } catch (error) {
        console.log("Error creating new administrator\n", error);
    }
}

function close(){
    rl.close();
    client.end();
    process.exit(0);
}