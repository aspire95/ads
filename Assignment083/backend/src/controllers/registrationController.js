const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.submitRegistration = async (req, res) => {
    const { username, password, roleName, fullName, email, deptName } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            `INSERT INTO registrations (username, password_hash, role_name, full_name, email, dept_name) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [username, hashedPassword, roleName, fullName, email, deptName]
        );
        res.status(201).json({ message: 'Registration request submitted! Please wait for Admin approval.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Registration failed. Username may already be taken.' });
    }
};

exports.getPendingRegistrations = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM registrations WHERE status = $1', ['Pending']);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.approveRegistration = async (req, res) => {
    const { regId, status } = req.body; // status: 'Approved' or 'Rejected'
    try {
        if (status === 'Rejected') {
            await db.query('UPDATE registrations SET status = $1 WHERE reg_id = $2', ['Rejected', regId]);
            return res.json({ message: 'Registration rejected.' });
        }

        // Approval Logic
        const regRes = await db.query('SELECT * FROM registrations WHERE reg_id = $1', [regId]);
        const reg = regRes.rows[0];

        if (!reg) return res.status(404).json({ message: 'Request not found' });

        // 1. Determine next ID (Sxxx or Ixxx)
        const roleRes = await db.query('SELECT role_id FROM roles WHERE role_name = $1', [reg.role_name]);
        const roleId = roleRes.rows[0].role_id;

        let newId;
        if (reg.role_name === 'Student') {
            const lastId = await db.query("SELECT ID FROM student WHERE ID LIKE 'S%' ORDER BY ID DESC LIMIT 1");
            const lastNum = lastId.rows.length ? parseInt(lastId.rows[0].id.substring(1)) : 0;
            newId = 'S' + String(lastNum + 1).padStart(3, '0');
            const newNum = lastNum + 1;
            const targetTable = (newNum % 2 === 0) ? 'students_shard_A' : 'students_shard_B';

            await db.query(`INSERT INTO ${targetTable} (ID, name, dept_name, email) VALUES ($1, $2, $3, $4)`,
                [newId, reg.full_name, reg.dept_name, reg.email]);
        } else {
            const lastId = await db.query("SELECT ID FROM instructor WHERE ID LIKE 'I%' ORDER BY ID DESC LIMIT 1");
            const lastNum = lastId.rows.length ? parseInt(lastId.rows[0].id.substring(1)) : 0;
            newId = 'I' + String(lastNum + 1).padStart(3, '0');

            await db.query('INSERT INTO instructor (ID, name, dept_name, email, salary) VALUES ($1, $2, $3, $4, 0)',
                [newId, reg.full_name, reg.dept_name, reg.email]);
        }

        // 2. Create User
        await db.query('INSERT INTO users (username, password_hash, role_id, ref_id) VALUES ($1, $2, $3, $4)',
            [reg.username, reg.password_hash, roleId, newId]);

        // 3. Mark as Approved
        await db.query('UPDATE registrations SET status = $1 WHERE reg_id = $2', ['Approved', regId]);

        res.json({ message: `Successfully approved! User ID: ${newId}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Approval failed' });
    }
};
