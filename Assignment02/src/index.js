const inquirer = require('inquirer');
const db = require('./db');
const fs = require('fs');
const path = require('path');

const clearScreen = () => console.log('\x1bc');

const mainMenu = async () => {
    clearScreen();
    console.log("==========================================================");
    console.log("   Assignment 2: PL/pgSQL & Object Relational DB Review   ");
    console.log("==========================================================");

    const { choice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'Select an Operation:',
            choices: [
                '1. Initialize Database (Run setup.sql)',
                '2. Part I(a): Insert 50 records in test_table',
                '3. Part I(b): Increase Product Prices',
                '4. Part II(a): Object Table (Name Word Count)',
                '5. Part II(b): Address Type Functions',
                '6. Part II(c): Course Type Object Table',
                new inquirer.Separator(),
                'Exit'
            ]
        }
    ]);

    try {
        switch (choice) {
            case '1. Initialize Database (Run setup.sql)':
                await initDatabase();
                break;
            case '2. Part I(a): Insert 50 records in test_table':
                await runPart1a();
                break;
            case '3. Part I(b): Increase Product Prices':
                await runPart1b();
                break;
            case '4. Part II(a): Object Table (Name Word Count)':
                await runPart2a();
                break;
            case '5. Part II(b): Address Type Functions':
                await runPart2b();
                break;
            case '6. Part II(c): Course Type Object Table':
                await runPart2c();
                break;
            case 'Exit':
                console.log("Goodbye!");
                process.exit(0);
        }
    } catch (error) {
        console.error("\n❌ Error:", error.message);
    }

 
    await inquirer.prompt([{ type: 'input', name: 'pause', message: '\nPress Enter to continue...' }]);
    mainMenu();
};


async function initDatabase() {
    console.log("\nReading and executing setup.sql...");
    const sqlPath = path.join(__dirname, '../sql/setup.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await db.query(sql);
    console.log("✅ Database setup successfully.");
}

async function runPart1a() {
    console.log("\nCalling procedure to insert 50 records into test_table...");
    await db.query('CALL insert_50_to_test_table()');
    console.log("✅ Procedure executed.");

    const res = await db.query('SELECT * FROM test_table ORDER BY RecordNumber LIMIT 5');
    console.log("Sample Data (First 5 rows):");
    console.table(res.rows);
}

async function runPart1b() {
    console.log("\nCurrent Products (Before Update):");
    const beforeInfo = await db.query('SELECT * FROM products');
    console.table(beforeInfo.rows);

    const { category, percentage } = await inquirer.prompt([
        { type: 'input', name: 'category', message: 'Enter Category (e.g., ELE, FUR):', default: 'ELE' },
        { type: 'number', name: 'percentage', message: 'Enter Percentage Increase (X):', default: 10 }
    ]);

    console.log(`\nIncreasing prices for category '${category}' by ${percentage}%...`);
    await db.query('CALL increase_price($1, $2)', [percentage, category]);

    console.log("✅ Prices updated.");
    console.log("\nCurrent Products (After Update):");
    const afterInfo = await db.query('SELECT * FROM products WHERE category = $1', [category]);
    console.table(afterInfo.rows);
}

async function runPart2a() {
    const { name } = await inquirer.prompt([
        { type: 'input', name: 'name', message: 'Enter a name/sentence (max 50 chars):', default: 'Computer Science Department' }
    ]);


    await db.query('INSERT INTO persons (name) VALUES ($1)', [name]);

    console.log("\n✅ Inserted into persons table. Querying word count function...");

    const res = await db.query(`
    SELECT name, countNoOfWords(name) as "Word Count" 
    FROM persons 
    ORDER BY name DESC LIMIT 1
  `);

    console.table(res.rows);
}

async function runPart2b() {
    console.log("\nExisting Addresses in 'user_addresses':");
    const list = await db.query('SELECT (full_address).address, (full_address).city FROM user_addresses');
    console.table(list.rows);

    const { action } = await inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'Select Method:',
        choices: [
            'i. Extract addresses based on keyword',
            'ii. Count words in specific field'
        ]
    }]);

    if (action.startsWith('i.')) {
        const { keyword } = await inquirer.prompt([{ type: 'input', name: 'keyword', message: 'Enter keyword (e.g., Main, Pune):' }]);
        const res = await db.query('SELECT * FROM extract_addresses_by_keyword($1)', [keyword]);
        console.log(`\nResults for keyword '${keyword}':`);
        console.table(res.rows);
    } else {
        const { field } = await inquirer.prompt([{
            type: 'list',
            name: 'field',
            message: 'Select field:',
            choices: ['address', 'city', 'state', 'pincode']
        }]);

        console.log(`\nCounting words in field '${field}' for all records...`);
        const res = await db.query(`
       SELECT 
         (full_address).address as address, 
         count_words_in_field(full_address, $1) as count
       FROM user_addresses
     `, [field]);
        console.table(res.rows);
    }
}

async function runPart2c() {
    console.log("\nFetching data from 'courses' (Object Table of course_Type)...");
    const res = await db.query('SELECT * FROM courses');
    console.table(res.rows);
}

mainMenu();
