import { describe, it, expect } from 'vitest';
import { cleanText, cleanName, cleanNote, cleanDate, LIMITS } from '../../src/utils/sanitize.js';

describe('sanitize', () => {
  it('trims whitespace', () => { expect(cleanText('  hello  ')).toBe('hello'); });
  it('collapses runs of whitespace', () => { expect(cleanText('a   b')).toBe('a b'); });
  it('drops control characters', () => { expect(cleanText('a\x01b\x1Fc')).toBe('a b c'); });
  it('caps length at max', () => { expect(cleanText('x'.repeat(200), 8)).toBe('x'.repeat(8)); });
  it('returns empty string for non-strings', () => { expect(cleanText(null)).toBe(''); });

  it('cleanName enforces name cap', () => { expect(cleanName('a'.repeat(200)).length).toBe(LIMITS.NAME_MAX); });
  it('cleanNote enforces note cap', () => { expect(cleanNote('b'.repeat(1000)).length).toBe(LIMITS.NOTE_MAX); });

  it('cleanDate accepts valid YYYY-MM-DD', () => { expect(cleanDate('2025-12-31')).toBe('2025-12-31'); });
  it('cleanDate rejects non-date strings', () => { expect(cleanDate('yesterday')).toBe(''); });
  it('cleanDate rejects nonsense dates', () => { expect(cleanDate('9999-99-99')).toBe(''); });
  it('cleanDate rejects wrong format', () => { expect(cleanDate('12/31/2025')).toBe(''); });
});
