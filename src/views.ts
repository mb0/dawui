import m from 'mithril'
import {Component} from 'mithril'
import {Man, QryRes} from './ctx'
import {Schema, Model} from './model'
import {Editor} from './editor'
import {typ, Type} from 'xelf/typ'
import {knd} from 'xelf/knd'

export const IndexView:Component<{man:Man}> = {
	view({attrs:{man}}) {
		const pr = man.ctx.proj
		if (!pr) return m('h1', `Project not found`)
		return [m('h1', `Project ${pr.name}  ${pr.vers}`),
			m('ul', (pr.schemas||[]).map(s =>
				m('li', m(m.route.Link, {href:`/${s.name}`}, s.name))
			)),
		]
	}
}

export const SchemaView:Component<{man:Man, node:string}> = {
	view({attrs:{man, node}}) {
		const s = man.ctx.map[node] as Schema|null
		if (!s) return m('h1', `Schema ${node} not found`)
		return [m('h1', `Schema ${s.name} ${s.vers}`),
			m('ul', s.models.map(mod =>
				m('li', m(m.route.Link, {href:`/${s.name}/${mod.name}`}, mod.name))
			)),
		]
	}
}

export const ModelView:Component<{man:Man, node:string}> = {
	view({attrs:{man, node}}) {
		const mod = man.ctx.map[node] as Model|null
		if (!mod) return m('h1', `Model ${node} not found`)
		return [m('h1', `Model ${mod.name} ${mod.vers}`),
			m('details', m('summary', "Model Details"),
				m('ul', mod.elems.map(el => m('li', el.name, ' ', el.type))),
			),
		]
	}
}

export const DetailView:Component<{man:Man, node:string}> = {
	view({attrs:{man, node}}) {
		const mod = man.ctx.map[node] as Model|null
		if (!mod) return m('h1', `Model ${node} not found`)
		return [m('h1', `Model ${mod.name} Detail ${man.key||''}`),
		]
	}
}

const isShort = (t:Type) => (t.kind&(knd.num|knd.bool)) != 0
const isList = (t:Type) => (t.kind&(knd.list)) != 0
const isStrc = (t:Type) => (t.kind&(knd.strc)) != 0

const inlineRes = (r:QryRes) => m('', typ.toStr(r.typ!), ": ", JSON.stringify(r.res))

const QueryResult:Component<{man:Man}> = {
	view({attrs:{man}}) {
		const r = man.res
		if (!r) return null
		if (r.err) return m('.err', r.err)
		if (!r.typ) return m('textarea',
			{cols:60, rows:15, disabled:true}, JSON.stringify(r.res),
		)
		// display short simple results inline
		if (!r.res || isShort(r.typ)) return inlineRes(r)
		if (isList(r.typ)) {
			if (!Array.isArray(r.res)||!r.res.length) return inlineRes(r)
			return [
				m('', typ.toStr(r.typ)),
				m('ul', r.res.map(el => m('li', JSON.stringify(el)))),
			]
		}
		if (isStrc(r.typ)) {

		}
		// fallback to text area
		return [
			m('', typ.toStr(r.typ)),
			m('textarea',
				{cols:60, rows:15, disabled:true}, JSON.stringify(r.res),
			),
		]
	}
}


export const QueryView:Component<{man:Man}> = {
	view({attrs:{man}}) {
		return m('form', {onsubmit: (e:any) => {
				e.redraw = false
				let qry = man.qry.trim()
				if (qry) man.query(qry).finally(() => m.redraw())
				return false
			}},
			m('h1', "Query"),
			m(Editor, {man}),
			m('', m('button[type=submit]', 'Run')),
			m(QueryResult, {man}),
		)
	}
}

export const Layout:Component<{man:Man, path:string[]}> = {
	view({attrs:{man, path}, children}) {
		if (!man.done) return m('h1', "loading...")
		let href = ''
		const isQuery = m.route.param("view") == 'query'
		const links = path.reduce((a, part:string, i:number) => {
			href += '/' + part
			const disabled = i == path.length-1 && !isQuery
			a.push(' > ', m(m.route.Link, {href, disabled}, part))
			return a
		}, [
			m(m.route.Link, {href:'?view=query', disabled: isQuery}, 'Query'),
			' | ',
			m(m.route.Link, {href:'/'}, man.ctx.proj!.name),
		])
		return m('.dawui',
			m('nav', {key:'nav'}, links),
			m('section', {key:'view'}, children),
			m(QueryView, {man, key:'qry'}),
		)
	}
}
