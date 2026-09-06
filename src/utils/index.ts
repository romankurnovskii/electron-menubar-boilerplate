// src/utils/index.ts
// Utility functions
//
// Add utilities here:
// - format.ts       - Date, number formatting
// - validation.ts  - Form validation
// - helpers.ts      - General helper functions
// - constants.ts    - App constants
// - etc.

// Example:
// export * from './format';
// export * from './validation';
// export * from './helpers';
// export * from './constants';

// Re-export commonly used utilities
export { formatCurrency, formatDate, formatNumber } from './format'
export { capitalize, cn, truncate } from './helpers'
export { validateEmail, validatePassword } from './validation'
