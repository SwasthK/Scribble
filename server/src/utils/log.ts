export const Log = (message: string = "LOG", ...rest: string[]): void => {
    console.log(`-------------------\n${message} :`)
    console.log("\t", ...rest);
}   
