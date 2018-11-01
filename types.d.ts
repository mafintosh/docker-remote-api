declare module 'docker-remote-api' {
    interface InitOptions {
        host: string;
    }

    interface GetOptions {
        qs?: {[name:string]: string},// set querystring parameters
        headers?: {[name:string]: string},// set request headers
        json?: boolean,             // return json instead of a stream
        buffer?: boolean,           // return a buffer instead of a stream
        drain?: boolean,            // will drain the response stream before calling cb
        timeout?: number,         // set request timeout
        version: string        // set explicit api version "v1.14" (required)
    }

    interface PostOptions extends GetOptions {
        body: string | null;   // set to NULL if there is no body json
    }

    class DockerRequest {
        get<T>(path: string, opt: GetOptions, fn: (err: Error, data: T) => void): void;
        delete<T>(path: string, opt: GetOptions, fn: (err: Error, data: T) => void): void;
        head<T>(path: string, opt: GetOptions, fn: (err: Error, data: T) => void): void;
        post<T>(path: string, opt: PostOptions, fn: (err: Error, data: T) => void): void;
		put<T>(path: string, opt: PostOptions, fn: (err: Error, data: T) => void): void;
    }

    function DockerInit(opt: InitOptions): DockerRequest;
    export = DockerInit;
}
