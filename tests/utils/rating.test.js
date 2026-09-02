import { describe, it, expect } from 'vitest';
import { clampRating, averageRating, MIN_RATING, MAX_RATING } from '../../src/utils/rating.js';

describe('rating', () => {
  it('clamps in range', () => {
    expect(clampRating(3)).toBe(3);
    expect(clampRating(0)).toBe(MIN_RATING);
    expect(clampRating(10)).toBe(MAX_RATING);
    expect(clampRating(-5)).toBe(MIN_RATING);
  });
  it('handles non-numbers', () => { expect(clampRating('oops')).toBe(MIN_RATING); });

  it('computes average to 1 decimal', () => {
    expect(averageRating([{ rating: 5 }, { rating: 4 }, { rating: 2 }])).toBe(3.7);
  });
  it('returns 0 for empty array', () => { expect(averageRating([])).toBe(0); });
  it('handles single item', () => { expect(averageRating([{ rating: 4 }])).toBe(4); });
  it('rounds correctly', () => {
    // 1+5+5=11/3=3.666... -> 3.7
    expect(averageRating([{ rating: 1 }, { rating: 5 }, { rating: 5 }])).toBe(3.7);
  });
});
