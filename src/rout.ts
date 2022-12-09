
export type Rout = (...args:any[])=>void

interface Route {
	pat:string
	re:RegExp
	fn:Rout
}

interface Location {
	hash: string
	href: string
	origin: string
	pathname: string
	search: string
	toString(): string
}

function makeRoute(pat:string|RegExp, fn:Rout):Route {
	if (typeof pat == "string") {
		let src = pat.
			replace(/\?/g, '\\?)').
			replace(/\*/g, '([^/?#]+?)').
			replace(/\.\./, '.*')
		return {pat: pat, re:  new RegExp('^'+src+'$'), fn}
	}
	return {pat: pat.toString(), re: pat, fn}
}

export class Router {
	base:string = "/"
	rs:Route[] = []
	def?:Rout
	cur?:string
	constructor() {}
	start(b?:string, auto = false) {
		if (b) this.base = b
		this.cur = this.appPath(location)
		window.addEventListener('popstate', e =>  {
			let p = this.appPath(location)
			if (p) {
				e.preventDefault()
				this._go(p)
			}
		})
		document.addEventListener('click', (e:MouseEvent) => {
			if (e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented)
				return
			let t:any = e.target
			while (t && t.nodeName != 'A') t = t.parentNode
			if (!t || t.nodeName != 'A') return
			let l = location
			if (!t.hasAttribute('href') || t.target && t.target !== '_self' ||
				t.origin != l.origin || !this.isAppPath(t.pathname) ||
				t.hasAttribute('download')
			) return
			e.preventDefault()
			if (t.pathname == l.pathname && t.search == l.search)
				return
			this.nav(t, false, t.title || document.title)
		})
		if (auto) this.nav()
	}
	isAppPath(p:string) {
		if (p.length == this.base.length-1)
			return this.base.startsWith(p)
		return p.length >= this.base.length && p.startsWith(this.base)
	}
	add(pat:string|RegExp, fn:Rout) {
		let r = makeRoute(pat, fn)
		if (r) this.rs.push(r)
	}
	addAll(rs:{[key:string]:Rout}):void {
		Object.keys(rs).forEach(k=>this.add(k, rs[k]))
	}
	nav(l:Location=location, repl?:boolean, t?:string):boolean {
		let p = this.appPath(l)
		return p && this.go(p, repl, t) || false
	}
	go(path:string, repl?:boolean, t?:string):boolean {
		if (repl || this.cur != path) this.show(path, repl, t)
		return this._go(path)
	}
	_go(path:string):boolean {
		this.cur = path
		let p = path.split(/[?#]/, 2)[0]
		let r = this.rs.find(r => {
			let m = p.match(r.re)
			if (!m) return false
			r.fn(...m.slice(1))
			return true
		})
		if (r) return true
		// default route
		if (this.def) this.def(path)
		return false
	}
	show(path:string, repl = false, t?:string) {
		t = t || document.title
		let s = repl ? 'replaceState' : 'pushState';
		(history as any)[s](null, t, this.base + path.replace(/^[/]/, ''))
		document.title = t
	}
	appPath(loc:Location, pure=false):string {
		let p = loc.pathname
		let res = ""
		if (p.startsWith(this.base))
			res = p.slice(this.base.length-1)
		else if (p.length == this.base.length-1 && p + "/" == this.base)
			res = "/"
		if (res&&!pure) res += loc.search + loc.hash
		return res
	}
	reroute(q:object, exec=true, repl=false) {
		let p = this.appPath(location).split(/[?#]/, 2)[0] +"?"+ paramsStr(q)
		if (exec) {
			this.go(p, repl)
		} else {
			this.show(p, repl)
		}
	}
}

export const router = new Router()

export default router

export function params() {
	let res:any = {}
	location.search.slice(1).split('&').forEach(s => {
		let [k, r] = s.split('=', 2)
		let v:any = r
		if (typeof r != "string") v = true
		res[k] = v
	})
	return res
}
export function param(key:string, def?:string) {
	return params()[key] || def
}

export function paramsStr(q:object) {
	let o = Object.assign(params(), q) as {[key:string]:any}
	return Object.keys(o).filter(key => key && o[key] != undefined).map(key => key+"="+o[key]).join('&')
}

