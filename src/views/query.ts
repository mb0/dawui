import {app} from '../app'
import {h} from '../h'
import {Type, Param, ParamBody, knd, typ, Sys} from 'xelf/typ'
import {Model, modelType} from 'daql/dom'
import {editor} from '../editor'
import {lookup, Man, QryRes} from '../ctx'

export const queryView = (man:Man) => ()=> {
	return h('form', {onsubmit: (e:any) => {
			e.redraw = false
			let qry = man.qry.trim()
			if (qry) man.query(qry).finally(() => app.redraw())
			return false
		}},
		h('hr'),
		h('', h('summary', "Query"),
			editor(man)(),
			h('', h('button', {type:'submit'}, 'Run')),
			queryResult(man)(),
		),
	)
}

const queryResult = (man:Man) => ()=> {
	const r = man.res
	if (!r) return null
	if (r.err) return h('.err', r.err)
	if (!r.typ) return h('textarea',
		{cols:60, rows:15, disabled:true}, JSON.stringify(r.res),
	)
	// instantiate type and resolve type refs to schema models
	const sys = new Sys()
	const lup = lookup(man.ctx)
	r.typ = sys.inst(lup, r.typ)
	// display short simple results inline
	if (!r.res || isShort(r.typ)) return inlineRes(r)
	if (isList(r.typ)) {
		if (!Array.isArray(r.res)||!r.res.length) return inlineRes(r)
		if (r.typ.body && 'kind' in r.typ.body && isKeyr(r.typ.body)) {
			let elt = r.typ.body
			return [
				h('', typ.toStr(r.typ)),
				table(man, elt, r.res)
			]
		}
		return [
			h('', typ.toStr(r.typ)),
			h('ul', r.res.map(el => h('li', JSON.stringify(el)))),
		]
	}
	if (isKeyr(r.typ)) {
		return [
			h('', typ.toStr(r.typ)),
			table(man, r.typ, [r.res]),
		]
	}
	// fallback to text area
	return [
		h('', typ.toStr(r.typ)),
		h('textarea',
			{cols:60, rows:15, disabled:true}, JSON.stringify(r.res),
		),
	]
}

const isShort = (t:Type) => (t.kind&(knd.num|knd.bool)) != 0
const isList = (t:Type) => (t.kind&(knd.list)) != 0
const isKeyr = (t:Type) => (t.kind&(knd.keyr)) != 0

const inlineRes = (r:QryRes) => h('', typ.toStr(r.typ!), ": ", JSON.stringify(r.res))

const getParams = (t:Type):ParamBody|null => t.body && 'params' in t.body ? t.body : null

const table = (man:Man, t:Type, list:any[]) => {
	if (!list||!list.length) return h('', "no data")
	let pb = getParams(t)
	if (pb && t.ref) {
		const m = man.ctx.map[t.ref]
		if (m) {
			const mt = modelType(m as Model)
			pb = getParams(mt)
		}
	}
	if (!pb||!pb.params) return h('', "no fields")
	return h('table',
		h('tr', pb.params.map(p => h('th', p.name))),
		list.map(el =>
			h('tr', pb!.params.map((p:Param) =>
				h('td', p.name ? tableCell(el[p.name.toLowerCase()]): '')
			)),
		),
	)
}

const tableCell = (val:any):string => {
	if (val == null) return ''
	if (typeof val == 'object') return JSON.stringify(val)
	return ''+val
}
