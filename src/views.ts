import m from 'mithril'
import {Component} from 'mithril'
import {Man} from './ctx'
import {Schema, Model} from './model'
import {Editor} from './editor'

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
			m('ul', mod.elems.map(el => m('li', el.name, ' ', el.type))),
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
			man.res && m('textarea', {cols:60, rows:15, disabled:true}, man.res)
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
