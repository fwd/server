# Date Parser Implementation

Local implementation to replace `chrono-node` functionality for natural language date parsing.

## Package Details

### Date Parser
- **Replaces**: `chrono-node` package
- **Files**: `index.js`
- **Description**: Simple natural language date parsing
- **Features**:
  - Relative dates: "now", "today", "tomorrow", "yesterday"
  - Future dates: "in X days/weeks/months/years"
  - Past dates: "X days/weeks/months/years ago"
  - Next/last patterns: "next monday", "last week", etc.
  - Common date formats: MM/DD/YYYY, YYYY-MM-DD, etc.
  - ISO date parsing
  - Fallback to current date

## Usage

```javascript
const parseDate = require('./dependencies/date-parser');

// Relative dates
parseDate('now')           // Current date
parseDate('today')         // Current date
parseDate('tomorrow')      // Tomorrow
parseDate('yesterday')     // Yesterday

// Future dates
parseDate('in 5 days')     // 5 days from now
parseDate('in 2 weeks')    // 2 weeks from now
parseDate('in 1 month')    // 1 month from now
parseDate('in 1 year')     // 1 year from now

// Past dates
parseDate('3 days ago')    // 3 days ago
parseDate('2 weeks ago')   // 2 weeks ago
parseDate('1 month ago')    // 1 month ago

// Next/last patterns
parseDate('next monday')   // Next Monday
parseDate('next week')     // Next week
parseDate('last friday')   // Last Friday
parseDate('last month')    // Last month

// Specific dates
parseDate('2024-01-15')    // January 15, 2024
parseDate('01/15/2024')    // January 15, 2024
parseDate('2024-12-25')    // December 25, 2024
```

## Supported Patterns

- **Relative**: now, today, tomorrow, yesterday
- **Future**: in X days/weeks/months/years
- **Past**: X days/weeks/months/years ago
- **Next**: next monday/tuesday/etc, next week/month/year
- **Last**: last monday/tuesday/etc, last week/month/year
- **Formats**: YYYY-MM-DD, MM/DD/YYYY, MM-DD-YYYY
- **ISO**: Standard ISO date strings
