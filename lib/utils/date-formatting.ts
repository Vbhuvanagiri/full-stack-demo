import { format, isThisYear } from 'date-fns';

// Format for activity table - balance between brevity and clarity
export function formatActivityDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();

  // Calculate time difference in milliseconds
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // For very recent times, show relative time
  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  // For older dates, show actual date
  if (isThisYear(date)) {
    // Same year - don't show year
    return format(date, 'MMM d');
  } else {
    // Different year - show year
    return format(date, 'MMM d, yyyy');
  }
}
