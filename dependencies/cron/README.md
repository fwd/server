# Cron Implementation

Local implementation of the `@fwd/cron` package to reduce external dependencies.

## Package Details

### @fwd/cron
- **Original Package**: `@fwd/cron@0.0.2`
- **Files**: `index.js`
- **Description**: Simple cron-like functionality for scheduling tasks
- **Features**:
  - Execute functions at specified intervals
  - Support for natural language intervals
  - Optional immediate execution
  - Returns interval ID for clearing

## Usage

```javascript
const cron = require('./dependencies/cron');

// Execute every 5 seconds
const interval = cron(() => {
  console.log('Hello!');
}, 5000);

// Execute with natural language
cron(() => {
  console.log('Every minute');
}, 'every 1 minute');

// Execute immediately and then repeat
cron(() => {
  console.log('Immediate and repeat');
}, 1000, true);

// Clear the interval
clearInterval(interval);
```

## Natural Language Support

The cron function supports natural language intervals:
- `'every 1 second'`
- `'every 2 minutes'`
- `'every 3 hours'`
- `'every 1 month'`
- `'every 1 year'`

## Dependencies

- Uses local `../time` implementation for natural language parsing
