import { describe, it, expect } from '@jest/globals';
import { createPaste, getPaste } from '@/lib/db';
import { Paste } from '@/lib/constants';

describe('Database Functions', () => {
  let createdPaste: Paste;

  it('should create a new paste', async () => {
    const pasteData = {
      title: 'Test Paste',
      content: 'This is a test paste.',
      language: 'plain',
      expiration: '1week',
      author: 'Jest Test',
    };

    createdPaste = await createPaste(pasteData);

    expect(createdPaste).toBeDefined();
    expect(createdPaste.title).toBe(pasteData.title);
    expect(createdPaste.content).toBe(pasteData.content);
    expect(createdPaste.short_id).toHaveLength(6);
  });

  it('should retrieve an existing paste', async () => {
    const retrievedPaste = await getPaste(createdPaste.short_id as string);

    expect(retrievedPaste).toBeDefined();
    expect(retrievedPaste?.id).toBe(createdPaste.id);
    expect(retrievedPaste?.title).toBe(createdPaste.title);
  });

  it('should return null for a non-existent paste', async () => {
    const nonExistentPaste = await getPaste('abcdef');
    expect(nonExistentPaste).toBeNull();
  });
}); 