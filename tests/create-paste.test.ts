import { describe, expect, test, afterAll } from '@jest/globals';
import { apiRequest, cleanupTestData, PasteData } from './setup';

describe('Create Paste API', () => {
  const testPasteIds: string[] = [];

  // After all tests, clean up created test data
  afterAll(async () => {
    await cleanupTestData(testPasteIds);
  });

  test('should create a new paste successfully', async () => {
    const pasteData = {
      title: 'Test Paste',
      content: 'This is a test paste created by automated testing.',
      expiration: '1hour'
    };

    const response = await apiRequest<PasteData>('/pastes', 'POST', pasteData);
    
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('url');
    expect(response.data).toHaveProperty('title', 'Test Paste');
    expect(response.data).toHaveProperty('content', 'This is a test paste created by automated testing.');
    expect(response.data).toHaveProperty('created_at');
    expect(response.data).toHaveProperty('expires_at');

    // Store ID for cleanup
    if (response.data.id) {
      testPasteIds.push(response.data.id);
    }
  });

  test('should create a paste with default title when no title provided', async () => {
    const pasteData = {
      content: 'Paste with no title',
      expiration: '1hour'
    };

    const response = await apiRequest<PasteData>('/pastes', 'POST', pasteData);
    
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('title', 'Untitled paste');
    
    // Store ID for cleanup
    if (response.data.id) {
      testPasteIds.push(response.data.id);
    }
  });

  test('should return error when content is missing', async () => {
    const pasteData = {
      title: 'Invalid Paste',
      expiration: '1hour'
    };

    const response = await apiRequest<{error: string}>('/pastes', 'POST', pasteData);
    
    expect(response.status).toBe(400);
    expect(response.data).toHaveProperty('error');
  });

  test('should handle large content correctly', async () => {
    // Generate a 50KB string
    const largeContent = 'A'.repeat(50 * 1024);
    
    const pasteData = {
      title: 'Large Content Paste',
      content: largeContent,
      expiration: '1hour'
    };

    const response = await apiRequest<PasteData>('/pastes', 'POST', pasteData);
    
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    
    // Store ID for cleanup
    if (response.data.id) {
      testPasteIds.push(response.data.id);
    }
  });

  test('should save custom syntax language', async () => {
    const pasteData = {
      title: 'JavaScript Code',
      content: 'const greeting = "Hello, world!"; console.log(greeting);',
      expiration: '1hour',
      syntax: 'javascript'
    };

    const response = await apiRequest<PasteData>('/pastes', 'POST', pasteData);
    
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('syntax', 'javascript');
    
    // Store ID for cleanup
    if (response.data.id) {
      testPasteIds.push(response.data.id);
    }
  });
}); 