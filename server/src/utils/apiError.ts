import { Context } from 'hono';

interface ErrorResponse {
    status: 'error';
    statusCode: number;
    message?: string;
    [key: string]: any;
}

export function apiError(
    c: Context,
    statusCode: number,
    message?: string,
    additionalProps?: object
) {
    const response: ErrorResponse = {
        status: 'error',
        statusCode,
        message,
        ...additionalProps
    };

    return c.json(response, { status: response.statusCode });
}
