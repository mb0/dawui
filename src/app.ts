import {patch, H, v, V} from './h'

export class App{
	o?:H
	cur?:V
	constructor(public el:HTMLElement) {}
	mount(f:V):void {
		this.cur = f
		this.o = patch(this.o||this.el, v(f))
	}
	redraw():void { this.cur && this.mount(this.cur) }
}
export const app = new App(document.createElement('div'))
