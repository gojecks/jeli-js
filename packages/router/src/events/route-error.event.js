export function RouteErrorEvent(path){
    this.url = path;
    this.message = 'unable to resolve route';
}