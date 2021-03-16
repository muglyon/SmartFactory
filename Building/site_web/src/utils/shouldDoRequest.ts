export default function shouldDoRequest(lastTime: Date) {
    return Date.now() - lastTime.getTime() >= 5*60*1000 //
}