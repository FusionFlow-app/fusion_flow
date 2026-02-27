import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 100,
  iterations: 100000,
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';

const payload = JSON.stringify({
  event: 'test',
  data: { name: 'benchmark', value: 42 },
});

const params = {
  headers: { 'Content-Type': 'application/json' },
};

export default function () {
  const res = http.post(`${BASE_URL}/flows/1/webhook/teste`, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has status ok': (r) => r.json().status === 'ok',
  });
}
