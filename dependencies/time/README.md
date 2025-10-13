# Time Implementation

Local implementation of the `@fwd/time` package to reduce external dependencies.

## Package Details

### @fwd/time
- **Original Package**: `@fwd/time@0.0.1`
- **Files**: `index.js`
- **Description**: Expressive time to millisecond conversion
- **Features**:
  - Convert seconds to milliseconds
  - Convert minutes to milliseconds
  - Convert hours to milliseconds
  - Convert months to milliseconds (730.001 hours)
  - Convert years to milliseconds (8760 hours)
  - Support for both singular and plural forms

## Usage

```javascript
const time = require('./dependencies/time');

// Convert to milliseconds
time(1, 'second')    // 1000
time(1, 'minute')    // 60000
time(1, 'hour')      // 3600000
time(1, 'month')     // 2628003600
time(1, 'year')      // 31536000000

// Plural forms also work
time(2, 'minutes')   // 120000
time(3, 'hours')     // 10800000
```

## Supported Units

- `second` / `seconds`
- `minute` / `minutes`
- `hour` / `hours`
- `month` / `months`
- `year` / `years`
