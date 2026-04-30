const autocannon = require('autocannon');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const outputFile = path.join(__dirname, 'ass4_results.json');
const baseUrl = 'http://localhost:3000'; // Adjust port if needed

async function registerAndLogin() {
    const username = `teacher_${Date.now()}`;
    const password = 'password123';
    const role = 'teacher';

    console.log(`Registering user: ${username}`);

    // Register
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
    });

    if (!regRes.ok) {
        throw new Error(`Registration failed: ${regRes.statusText}`);
    }

    console.log('User registered. Logging in...');

    // Login
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (!loginRes.ok) {
        throw new Error(`Login failed: ${loginRes.statusText}`);
    }

    const data = await loginRes.json();
    if (!data.token) {
        throw new Error('Login succeeded but no token returned!');
    }

    console.log('Login successful. Token obtained.');
    return data.token;
}

function runAutocannon(opts) {
    return new Promise((resolve, reject) => {
        const instance = autocannon(opts, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
        autocannon.track(instance, { renderProgressBar: true });
    });
}

async function runBenchmarks() {
    try {
        console.log('Starting Assignment 4 Benchmarks...');

        // 1. Static/Baseline Benchmark
        console.log('\n--- Scenario A: Static/Baseline (GET /) ---');
        // Note: Assignment 4 doesn't have a root route explicitly defined in server.js provided, 
        // but typically express serves one or 404. 
        // We will target a known simple route or 404 if root is missing,
        // but requirements say "GET request to the root (/)".
        // If it 404s, it still measures server overhead.

        const staticResult = await runAutocannon({
            url: `${baseUrl}/`,
            connections: 10,
            duration: 10,
            title: 'Assignment 4 Static Benchmark'
        });

        // 2. Protected Benchmark
        console.log('\n--- Scenario B: Protected Route (GET /api/questions) ---');
        const token = await registerAndLogin();

        const protectedResult = await runAutocannon({
            url: `${baseUrl}/api/questions`,
            connections: 10,
            duration: 10,
            headers: {
                'Authorization': token
            },
            title: 'Assignment 4 Protected Benchmark'
        });

        // Compile Results
        const results = {
            static: {
                requests: { mean: staticResult.requests.mean },
                latency: { mean: staticResult.latency.mean },
                throughput: { mean: staticResult.throughput.mean }
            },
            protected: {
                requests: { mean: protectedResult.requests.mean },
                latency: { mean: protectedResult.latency.mean },
                throughput: { mean: protectedResult.throughput.mean }
            }
        };

        console.log('\nWriting results to file...');
        fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
        console.log(`Results saved to ${outputFile}`);

    } catch (err) {
        console.error('Benchmark failed:', err);
    }
}

runBenchmarks();
