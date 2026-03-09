import { createMocks } from 'node-mocks-http';
import { GET } from '../../src/app/api/generate/route';

describe('/api/generate Integration Test', () => {
    it('should return a 200 OK and valid JSON structure', async () => {
        const { req, res } = createMocks({
            method: 'GET',
            query: { difficulty: 'Hard' },
        });

        // Create an App Router compatible Request object
        const request = new Request('http://localhost:3000/api/generate?difficulty=Hard');
        const response = await GET(request);

        expect(response.status).toBe(200);
        const data = await response.json();

        expect(data).toHaveProperty('industry');
        expect(data).toHaveProperty('architecture');
        expect(data).toHaveProperty('painPoints');
        expect(Array.isArray(data.painPoints)).toBe(true);
    });
});
