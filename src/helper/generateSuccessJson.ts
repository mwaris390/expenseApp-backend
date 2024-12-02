export function GenerateSuccessJSON(message:string,data:unknown){
    const json = {
        status:true,
        message:message,
        data:data
    }
    return json
}