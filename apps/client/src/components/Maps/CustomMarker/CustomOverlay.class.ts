export class CustomOverlay extends google.maps.OverlayView{

    private container: HTMLElement;
    private pane: keyof google.maps.MapPanes;
    private position: google.maps.LatLng;

    constructor(container: HTMLElement, pane: keyof google.maps.MapPanes, position: google.maps.LatLng)
    {
        super()
        this.container = container
        this.pane = pane
        this.position = position
    }

    onAdd(): void  //what will be added
    {
        const pane = this.getPanes()?.[this.pane]
        pane?.appendChild(this.container)
    }

    draw(): void 
    {
        const projection = this.getProjection()
        const point = projection.fromLatLngToDivPixel(this.position)
        if(point === null)
        {
            return
        }
        //console.log(point)
        this.container.style.transform = `translate(${point.x}px, ${point.y}px)`

    }

    //called when setMap() is set to null
    onRemove(): void {
        if (this.container.parentNode !== null) {
            this.container.parentNode.removeChild(this.container)
          }
    }

}