import mockData from '../testdata/mock_case_study.json';

describe('Case Study Mock Data Unit Test', () => {
    it('should contain the required schema properties', () => {
        expect(mockData).toHaveProperty('industry');
        expect(mockData).toHaveProperty('architecture');
        expect(mockData).toHaveProperty('painPoints');
        expect(Array.isArray(mockData.painPoints)).toBe(true);
    });
});
