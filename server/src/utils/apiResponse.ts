import { Context } from "hono";

interface SuccessResponse {
    status: 'success';
    statusCode: 200 | number;
    data: any;
    message?: string;
    [key: string]: any;
}

export function apiResponse(c: Context, statusCode: number, data: any, message?: string, additionalProps?: object) {
    const response: SuccessResponse = {
        status: 'success',
        statusCode,
        data,
        message,
        ...additionalProps
    }

    return c.json(response, { status: response.statusCode });
}