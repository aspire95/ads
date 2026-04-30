const db = require('../config/db');

exports.getStats = async (req, res) => {
    const { role, refId } = req.user;

    try {
        if (role === 'Admin') {
            const depts = await db.query('SELECT COUNT(*) FROM department');
            const instructors = await db.query('SELECT COUNT(*) FROM instructor');
            const students = await db.query('SELECT COUNT(*) FROM student');
            const courses = await db.query('SELECT COUNT(*) FROM course');
            const budget = await db.query('SELECT SUM(budget) FROM department');

            return res.json({
                counts: {
                    departments: depts.rows[0].count,
                    instructors: instructors.rows[0].count,
                    students: students.rows[0].count,
                    courses: courses.rows[0].count
                },
                totalBudget: budget.rows[0].sum
            });
        }

        if (role === 'Faculty') {
            const myCourses = await db.query(
                `SELECT c.course_id, c.title, s.sec_id, s.semester, s.year 
                 FROM teaches t 
                 JOIN section s ON t.course_id = s.course_id AND t.sec_id = s.sec_id 
                 JOIN course c ON s.course_id = c.course_id 
                 WHERE t.ID = $1`, [refId]);

            const studentCount = await db.query(
                `SELECT COUNT(DISTINCT ID) FROM takes 
                 WHERE (course_id, sec_id, semester, year) IN 
                 (SELECT course_id, sec_id, semester, year FROM teaches WHERE ID = $1)`, [refId]);

            const taskCount = await db.query('SELECT COUNT(*) FROM tasks WHERE instructor_id = $1', [refId]);

            return res.json({
                courses: myCourses.rows,
                totalMyStudents: studentCount.rows[0].count,
                pendingTasks: taskCount.rows[0].count
            });
        }

        if (role === 'Student') {
            const myGrades = await db.query(
                `SELECT c.title, t.semester, t.year, t.grade 
                 FROM takes t 
                 JOIN course c ON t.course_id = c.course_id 
                 WHERE t.ID = $1`, [refId]);

            const myCredits = await db.query('SELECT tot_cred FROM student WHERE ID = $1', [refId]);
            const taskCount = await db.query(
                `SELECT COUNT(*) FROM tasks 
                 WHERE course_id IN (SELECT course_id FROM takes WHERE ID = $1)
                 AND task_id NOT IN (SELECT task_id FROM task_submissions WHERE student_id = $1)`,
                [refId]
            );

            return res.json({
                grades: myGrades.rows,
                totalCredits: myCredits.rows[0]?.tot_cred || 0,
                pendingTasks: taskCount.rows[0].count
            });
        }

        res.status(403).json({ message: 'Unknown role' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};
