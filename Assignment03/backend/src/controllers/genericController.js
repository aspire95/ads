const db = require('../config/db');

// Role-based visible tables
const ROLE_ACCESS = {
    Admin: null, // Full access
    Faculty: ['student', 'instructor', 'course', 'section', 'teaches', 'takes', 'attendance', 'tasks', 'syllabus', 'department'],
    Student: ['student', 'course', 'section', 'tasks', 'attendance', 'hostel', 'fees']
};

exports.getEntities = async (req, res) => {
    const { role } = req.user;
    try {
        const result = await db.query(
            `SELECT table_name 
             FROM information_schema.tables 
             WHERE table_schema = 'public' 
             AND table_name NOT IN ('users', 'roles')`
        );
        let tables = result.rows.map(row => row.table_name);

        if (ROLE_ACCESS[role]) {
            tables = tables.filter(t => ROLE_ACCESS[role].includes(t));
        }

        res.json(tables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSchema = async (req, res) => {
    const { table } = req.params;
    try {
        const result = await db.query(
            `SELECT column_name, data_type, is_nullable, column_default
             FROM information_schema.columns 
             WHERE table_name = $1 AND table_schema = 'public'`,
            [table]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getData = async (req, res) => {
    const { table } = req.params;
    const { role, refId } = req.user;

    try {
        // Basic data isolation
        let query = `SELECT * FROM ${table}`;
        let params = [];

        if (role === 'Student') {
            if (table === 'student' || table === 'takes' || table === 'advisor') {
                const idCol = table === 'advisor' ? 's_ID' : 'ID';
                query += ` WHERE ${idCol} = $1`;
                params = [refId];
            } else if (table === 'course' || table === 'section') {
                // Students can see all courses/sections
            } else {
                return res.status(403).json({ message: 'Access denied to this table' });
            }
        } else if (role === 'Faculty') {
            if (table === 'instructor') {
                query += ` WHERE ID = $1`;
                params = [refId];
            } else if (table === 'teaches' || table === 'tasks') {
                const idCol = table === 'tasks' ? 'instructor_id' : 'ID';
                query += ` WHERE ${idCol} = $1`;
                params = [refId];
            } else if (table === 'student' || table === 'attendance') {
                const depQuery = `SELECT dept_name FROM instructor WHERE ID = $1`;
                query += ` WHERE dept_name IN (${depQuery})`;
                params = [refId];
            }
        }

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.insertData = async (req, res) => {
    const { table } = req.params;
    const data = req.body;
    const keys = Object.keys(data);
    const values = Object.values(data);
    const columns = keys.join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    try {
        await db.query(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`, values);
        res.status(201).json({ message: 'Success' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateData = async (req, res) => {
    const { table } = req.params;
    const { data, keys: pkValues } = req.body;

    const setClause = Object.keys(data).map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = Object.values(data);

    const pkKeys = Object.keys(pkValues);
    const whereClause = pkKeys.map((key, i) => `${key} = $${values.length + i + 1}`).join(' AND ');
    const allValues = [...values, ...Object.values(pkValues)];

    try {
        await db.query(`UPDATE ${table} SET ${setClause} WHERE ${whereClause}`, allValues);
        res.json({ message: 'Updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteData = async (req, res) => {
    const { table } = req.params;
    const pkValues = req.body;

    const pkKeys = Object.keys(pkValues);
    const whereClause = pkKeys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
    const values = Object.values(pkValues);

    try {
        await db.query(`DELETE FROM ${table} WHERE ${whereClause}`, values);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
