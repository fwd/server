// Simple natural language date parser
// Replaces chrono-node functionality

module.exports = (dateString) => {
  if (!dateString || typeof dateString !== 'string') {
    return new Date();
  }

  const now = new Date();
  const lowerString = dateString.toLowerCase().trim();

  // Handle relative dates
  if (lowerString === 'now' || lowerString === 'today') {
    return now;
  }

  if (lowerString === 'tomorrow') {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  if (lowerString === 'yesterday') {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }

  // Handle "in X days/weeks/months/years"
  const inMatch = lowerString.match(/^in\s+(\d+)\s+(day|days|week|weeks|month|months|year|years)$/);
  if (inMatch) {
    const amount = parseInt(inMatch[1]);
    const unit = inMatch[2];
    const future = new Date(now);

    switch (unit) {
      case 'day':
      case 'days':
        future.setDate(future.getDate() + amount);
        break;
      case 'week':
      case 'weeks':
        future.setDate(future.getDate() + (amount * 7));
        break;
      case 'month':
      case 'months':
        future.setMonth(future.getMonth() + amount);
        break;
      case 'year':
      case 'years':
        future.setFullYear(future.getFullYear() + amount);
        break;
    }
    return future;
  }

  // Handle "X days/weeks/months/years ago"
  const agoMatch = lowerString.match(/^(\d+)\s+(day|days|week|weeks|month|months|year|years)\s+ago$/);
  if (agoMatch) {
    const amount = parseInt(agoMatch[1]);
    const unit = agoMatch[2];
    const past = new Date(now);

    switch (unit) {
      case 'day':
      case 'days':
        past.setDate(past.getDate() - amount);
        break;
      case 'week':
      case 'weeks':
        past.setDate(past.getDate() - (amount * 7));
        break;
      case 'month':
      case 'months':
        past.setMonth(past.getMonth() - amount);
        break;
      case 'year':
      case 'years':
        past.setFullYear(past.getFullYear() - amount);
        break;
    }
    return past;
  }

  // Handle "next X" patterns
  const nextMatch = lowerString.match(/^next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month|year)$/);
  if (nextMatch) {
    const unit = nextMatch[1];
    const future = new Date(now);

    switch (unit) {
      case 'week':
        future.setDate(future.getDate() + 7);
        break;
      case 'month':
        future.setMonth(future.getMonth() + 1);
        future.setDate(1); // First day of next month
        break;
      case 'year':
        future.setFullYear(future.getFullYear() + 1);
        future.setMonth(0, 1); // January 1st of next year
        break;
      default:
        // Handle weekdays
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const targetDay = dayNames.indexOf(unit);
        if (targetDay !== -1) {
          const currentDay = now.getDay();
          const daysUntilTarget = (targetDay - currentDay + 7) % 7;
          future.setDate(future.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget));
        }
        break;
    }
    return future;
  }

  // Handle "last X" patterns
  const lastMatch = lowerString.match(/^last\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month|year)$/);
  if (lastMatch) {
    const unit = lastMatch[1];
    const past = new Date(now);

    switch (unit) {
      case 'week':
        past.setDate(past.getDate() - 7);
        break;
      case 'month':
        past.setMonth(past.getMonth() - 1);
        past.setDate(1); // First day of last month
        break;
      case 'year':
        past.setFullYear(past.getFullYear() - 1);
        past.setMonth(0, 1); // January 1st of last year
        break;
      default:
        // Handle weekdays
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const targetDay = dayNames.indexOf(unit);
        if (targetDay !== -1) {
          const currentDay = now.getDay();
          const daysSinceTarget = (currentDay - targetDay + 7) % 7;
          past.setDate(past.getDate() - (daysSinceTarget === 0 ? 7 : daysSinceTarget));
        }
        break;
    }
    return past;
  }

  // Handle specific date formats
  // Try to parse as ISO date first
  const isoDate = new Date(dateString);
  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }

  // Handle month name formats like "January 1, 2024"
  const monthNameMatch = lowerString.match(/^(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (monthNameMatch) {
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const month = monthNames.indexOf(monthNameMatch[1]);
    const day = parseInt(monthNameMatch[2]);
    const year = parseInt(monthNameMatch[3]);
    
    if (month !== -1 && !isNaN(day) && !isNaN(year)) {
      const parsedDate = new Date(year, month, day);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
  }

  // Try common date formats
  const formats = [
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // MM/DD/YYYY or DD/MM/YYYY
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // MM-DD-YYYY or DD-MM-YYYY
  ];

  for (const format of formats) {
    const match = dateString.match(format);
    if (match) {
      let year, month, day;
      
      if (format.source.includes('\\d{4}')) {
        // YYYY-MM-DD format
        year = parseInt(match[1]);
        month = parseInt(match[2]) - 1; // JavaScript months are 0-indexed
        day = parseInt(match[3]);
      } else {
        // Assume MM/DD/YYYY format (US format)
        month = parseInt(match[1]) - 1; // JavaScript months are 0-indexed
        day = parseInt(match[2]);
        year = parseInt(match[3]);
      }
      
      const parsedDate = new Date(year, month, day);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
  }

  // If all else fails, return current date
  return now;
};
