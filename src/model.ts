import {parseKindName} from 'xelf/knd'
import {scan} from 'xelf/ast'
import {Type, parseType} from 'xelf/typ'

export interface Version {
	name:string
	vers:string
	date:Date
	minor:string
	patch:string
}
export interface Node {
	name:string
	vers:string
	extra?:{[key:string]:any}
}
export interface Project extends Node {
	path:string
	schemas:Schema[]
}
export interface Schema extends Node {
	models:Model[]
}
export interface Model extends Node {
	schema:string
	qname:string
	key:string
	kind:string
	elems:Elem[]
}
export interface Elem {
	name:string
	key:string
	type:string
	bits?:number
	val?:number
}

export function modelType(m:Model):Type {
	const kind = parseKindName(m.kind)
	const params = m.elems.map(el => {
		const elt = parseType(scan(el.type))
		return {name:el.key.toLowerCase(), typ:elt}
	})
	return {kind, id:0, body:{name:m.qname, params}}
}
