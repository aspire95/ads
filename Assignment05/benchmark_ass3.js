const autocannon = require('autocannon');
const fs = require('fs');
const path = require('path');

const outputFile = path.join(__dirname, 'ass3_results.json');
const targetUrl = 'http://localhost:3000/api/departments'; // Adjust port if needed

async function runBenchmark() {
    console.log(`Starting benchmark for Assignment 3 (Student MIS)...`);
    console.log(`Target: ${targetUrl}`);
    console.log(`Scenario: Database-Bound (GET /api/departments)`);

    const instance = autocannon({
        url: targetUrl,
        connections: 10, // 10 concurrent connections
        duration: 10,    // 10 seconds duration
        pipelining: 1,   // Default pipelining
        title: 'Assignment 3 Benchmark'
    });

    autocannon.track(instance, { renderProgressBar: true });

    instance.on('done', (result) => {
        console.log('Benchmark completed.');

        const metrics = {
            requests: {
                mean: result.requests.mean,
                stdDev: result.requests.stdDev,
                total: result.requests.total
            },
            latency: {
                mean: result.latency.mean,
                stdDev: result.latency.stdDev,
                p99: result.latency.p99
            },
            throughput: {
                mean: result.throughput.mean,
                stdDev: result.throughput.stdDev,
                total: result.throughput.total
            }
        };

        console.log('Writing results to file...');
        fs.writeFileSync(outputFile, JSON.stringify(metrics, null, 2));
        console.log(`Results saved to ${outputFile}`);
    });
}

runBenchmark();
