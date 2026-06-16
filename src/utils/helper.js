import {
  differenceInDays,
  differenceInMinutes,
  format,
  isValid,
  parse,
  parseISO,
} from "date-fns";

export function capitalizeName(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function changeDateFormat(to, from) {
  const formattedDate = format(new Date(to), from);
  return formattedDate;
}

export function convertTo12HourFormat(time24h) {
  const parsedDate = parse(time24h, 'HH:mm:ss', new Date());
  return format(parsedDate, 'hh:mm a');
}

export function roundTo2(num) {
  return Number(num.toFixed(2));
}

export const formatIndian = (number) => {
  return new Intl.NumberFormat("en-IN").format(number);
};

export const formatDuration = (time) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  let result = "";
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m`;
  return result.trim();
};

export const getYoutubeEmbedUrl = (url) => {
  if (!url) return "";
  const regExp =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
  const match = url.match(regExp);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};