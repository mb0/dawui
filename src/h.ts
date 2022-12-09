import {init, vnode, VNode, VNodeData,
	propsModule as pm,
	eventListenersModule as em,
} from 'snabbdom'

export const patch = init([pm, em])

export type H = VNode
export type P = VNodeData
export type V = ()=>H|H[]
export type HStr = H|string
export type HArg = HStr|HStr[]|null

const srx = /^(\w+)?(?:#([^.]*))?(?:[.]([^ ]*))?$/
const _ = undefined
export function v(f:V):H {
	const r = f()
	if (!Array.isArray(r)) return r
	return vnode(_,{},r,_,_)
}
export function h(s:string, a?:P|HArg, ...d:HArg[]):H {
	const m = s.match(srx)
	if (!m) throw new Error("invalid selector: "+s)
	const cs:H[] = []
	const p = data(m, add(cs, a)?a:_)
	d.forEach(e => add(cs, e))
	return vnode(m[1]||'div', p, cs, _, _)
}
function data(m:string[], d?:P) {
	if (d) {
		let {props, on, hook, key} = d
		delete d.props
		delete d.on
		delete d.hook
		delete d.key
		props = props ? Object.assign(props, d) : d
		d = {props, on, hook, key}
	} else d = {}
	if (m[2] || m[3]) {
		const a = d.props || {}
		if (m[2]) a.id = m[2]
		if (m[3]) a.className = m[3].replace('.', ' ')
		d.props = a
	}
	return d
}
function add(cs:H[], a?:P|HArg):a is P {
	if (!a) {}
	else if (typeof a == 'string') cs.push(vnode(_,_,_,a,_))
	else if ('sel' in a) cs.push(a as VNode)
	else if (Array.isArray(a)) a.forEach(e => add(cs, e))
	else return true
	return false
}
