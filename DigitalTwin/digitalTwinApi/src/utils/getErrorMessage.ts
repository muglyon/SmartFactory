export default function getErrorMessage(err: any) {
    if(err.details){
        if(err.details.error.details) {
            return err.details.error.details[0]
        } else return err.details.error
    } else return err.message
}