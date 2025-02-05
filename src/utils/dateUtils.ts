import { format } from 'date-fns-tz';
export const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
};

export const formatTime = (dateString: string) => {
  if (!dateString) return 'N/A';
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
};

export const toZonedDateTime = (
  localDateTime: string,
  timeZone: string = 'Asia/Bangkok',
) => {
  if (!localDateTime) return null;

  try {
    // Convert to ZonedDateTime format with nanoseconds and timezone offset
    const zonedTime = format(
      new Date(localDateTime),
      "yyyy-MM-dd'T'HH:mm:ss.SSSSSSXXX",
      { timeZone },
    );
    return zonedTime;
  } catch (error) {
    console.error('Error converting to ZonedDateTime:', error);
    return null;
  }
};
