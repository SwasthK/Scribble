import TimeAgo from "javascript-time-ago";
import { memo } from "react";
import en from "javascript-time-ago/locale/en.json";

export const ActiveSince = memo(({ date }: { date: any }) => {
    TimeAgo.addLocale(en);

    const timeAgo = new TimeAgo("en-US");

    const formattedTime = timeAgo
        .format(new Date(date), "round-minute")
        .replace(" ago", "");

    return `Active since ${formattedTime}`;
});