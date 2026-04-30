require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const { authenticateToken, authorizeRole } = require('./middleware/auth');
const authController = require('./controllers/authController');
const genericController = require('./controllers/genericController');
const dashboardController = require('./controllers/dashboardController');
const registrationController = require('./controllers/registrationController');
const taskController = require('./controllers/taskController');

const app = express();
app.use(cors());
app.use(express.json());

// Auth & Registration Routes
app.post('/api/auth/login', authController.login);
app.post('/api/register/request', registrationController.submitRegistration);
app.get('/api/register/requests', authenticateToken, authorizeRole(['Admin']), registrationController.getPendingRegistrations);
app.post('/api/register/approve', authenticateToken, authorizeRole(['Admin']), registrationController.approveRegistration);

// Task & Collaboration Routes
app.get('/api/tasks', authenticateToken, taskController.getTasks);
app.post('/api/tasks', authenticateToken, authorizeRole(['Faculty']), taskController.createTask);
app.post('/api/tasks/submit', authenticateToken, authorizeRole(['Student']), taskController.submitTask);
app.get('/api/tasks/:taskId/submissions', authenticateToken, authorizeRole(['Faculty']), taskController.getSubmissions);
app.post('/api/tasks/grade', authenticateToken, authorizeRole(['Faculty']), taskController.gradeSubmission);

// Dashboard Routes
app.get('/api/dashboard/stats', authenticateToken, dashboardController.getStats);

// Generic CRUD Routes (Restricted for Admin mostly)
app.get('/api/entities', authenticateToken, genericController.getEntities);
app.get('/api/schema/:table', authenticateToken, genericController.getSchema);
app.get('/api/data/:table', authenticateToken, genericController.getData);
app.post('/api/data/:table', authenticateToken, authorizeRole(['Admin']), genericController.insertData);
app.put('/api/data/:table', authenticateToken, authorizeRole(['Admin', 'Faculty']), genericController.updateData);
app.post('/api/data/:table/delete', authenticateToken, authorizeRole(['Admin']), genericController.deleteData);

// Health check
app.get('/', (req, res) => res.send('Student MIS API Running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
