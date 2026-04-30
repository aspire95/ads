const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function setup() {
    try {
        console.log('--- Starting Role-Based User Seeding ---');

        const seedUser = async (username, password, roleName, refId = null) => {
            const hashed = await bcrypt.hash(password, 10);
            const r = await db.query('SELECT role_id FROM roles WHERE role_name = $1', [roleName]);

            if (r.rows.length === 0) {
                console.error(`❌ Role "${roleName}" not found.`);
                return;
            }

            const rId = r.rows[0].role_id;
            const check = await db.query('SELECT * FROM users WHERE username = $1', [username]);

            if (check.rows.length === 0) {
                await db.query('INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ($1, $2, $3, $4)', [username, hashed, rId, refId]);
                console.log(`✅ User Created: ${username} (${roleName}) -> ID: ${refId || 'N/A'}`);
            } else {
                await db.query('UPDATE users SET password_hash = $1, role_id = $2, ref_id = $3 WHERE username = $4', [hashed, rId, refId, username]);
                console.log(`✅ User Updated: ${username} (${roleName}) -> ID: ${refId || 'N/A'}`);
            }
        };

        // 1. Admin Users (College Level)
        await seedUser('admin', 'admin123', 'Admin');
        await seedUser('mayur', 'mayur123', 'Admin');

        // 2. Faculty Users (Department Level) - Linked to Instructor ID
        await seedUser('rahul', 'rahul123', 'Faculty', 'I001');
        await seedUser('rohan', 'rohan123', 'Faculty', 'I002');

        // 3. Student Users - Linked to Student ID
        await seedUser('sagar', 'sagar123', 'Student', 'S001');
        await seedUser('suyog', 'suyog123', 'Student', 'S002');

        console.log('--- Seeding Completed Successfully ---');
        process.exit(0);
    } catch (err) {
        console.error('❌ Setup failed:', err);
        process.exit(1);
    }
}

setup();
