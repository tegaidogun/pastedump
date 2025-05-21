import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import { apiRequest, cleanupTestData, PasteData, USE_MOCKS } from './setup';
import fetch from 'node-fetch';

describe('Get Paste API', () => {
  const testPasteIds: string[] = [];

  // Create a test paste before tests
  beforeAll(async () => {
    // Create a test paste
    const pasteData = {
      title: 'Test Retrieval Paste',
      content: 'This is a test paste for retrieval testing.',
      expiration: '1hour'
    };

    const response = await apiRequest<PasteData>('/pastes', 'POST', pasteData);
    
    if (response.data.id) {
      testPasteIds.push(response.data.id);
    }
  });

  // After all tests, clean up created test data
  afterAll(async () => {
    await cleanupTestData(testPasteIds);
  });

  test('should retrieve a paste by ID', async () => {
    if (testPasteIds.length === 0) {
      throw new Error('No test paste was created');
    }

    const pasteId = testPasteIds[0];
    const response = await apiRequest<PasteData>(`/pastes/${pasteId}`);
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('title');
    expect(response.data).toHaveProperty('content');
  });

  test('should return 404 for non-existent paste', async () => {
    const nonExistentId = 'nonexistent';
    const response = await apiRequest<{error: string}>(`/pastes/${nonExistentId}`);
    
    expect(response.status).toBe(404);
    expect(response.data).toHaveProperty('error');
  });

  test('should retrieve recent pastes', async () => {
    const response = await apiRequest<{pastes: PasteData[]}>('/pastes');
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('pastes');
    expect(Array.isArray(response.data.pastes)).toBe(true);
    
    // Verify paste structure and limit
    expect(response.data.pastes.length).toBeLessThanOrEqual(5);
    if (response.data.pastes.length > 0) {
      const firstPaste = response.data.pastes[0];
      expect(firstPaste).toHaveProperty('id');
      expect(firstPaste).toHaveProperty('title');
      // Recent pastes endpoint doesn't include content field
      expect(firstPaste).toHaveProperty('created_at');
      // Check for view_count which is included
      expect(firstPaste).toHaveProperty('view_count');
      // Check for syntax field
      expect(firstPaste).toHaveProperty('syntax');
    }
  });

  test('should retrieve raw paste content', async () => {
    // Skip this test when using mocks as it requires direct fetch
    if (USE_MOCKS) {
      console.log('Skipping raw content test when using mocks');
      return;
    }
    
    if (testPasteIds.length === 0) {
      throw new Error('No test paste was created');
    }

    const pasteId = testPasteIds[0];
    
    // Need to use fetch directly for raw response
    const response = await fetch(`http://localhost:3000/api/pastes/${pasteId}/raw`);
    const rawContent = await response.text();
    
    expect(response.status).toBe(200);
    expect(rawContent).toBe('This is a test paste for retrieval testing.');
    expect(response.headers.get('Content-Type')).toContain('text/plain');
  });
}); 