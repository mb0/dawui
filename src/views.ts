import m from 'mithril'
import {Component} from 'mithril'
import {Man} from './ctx'
import {Project, Schema, Model} from './model'

export const IndexView:Component<{man:Man, pr:Project}> = {
	view({attrs:{man,pr}}) {
		return [m('h1', `Project ${pr.name}  ${pr.vers}`),
			m('ul', (pr.schemas||[]).map(s =>
				m('li', m(m.route.Link, {href:`/${s.name}`}, s.name))
			)),
		]
	}
}

export const SchemaView:Component<{man:Man, s:Schema}> = {
	view({attrs:{man, s}}) {
		return [m('h1', `Schema ${s.name} ${s.vers}`),
			m('ul', s.models.map(mod =>
				m('li', m(m.route.Link, {href:`/${s.name}/${mod.name}`}, mod.name))
			)),
		]
	}
}

export const ModelView:Component<{man:Man, mod:Model}> = {
	view({attrs:{man, mod}}) {
		return [m('h1', `Model ${mod.name} ${mod.vers}`),
			m('ul', mod.elems.map(el => m('li', el.name, ' ', el.type))),
		]
	}
}

export const DetailView:Component<{man:Man, mod:Model}> = {
	view({attrs:{man, mod}}) {
		return [m('h1', `Model ${mod.name} Detail ${man.key||''}`),
		]
	}
}

export const QueryView:Component<{man:Man}> = {
	view({attrs:{man}}) {
		return m('form', {onsubmit: (e:any) => {
				e.redraw = false
				let qry = man.qry.trim()
				if (qry) man.query(qry)
				return false
			}},
			m('h1', "Query"),
			m('textarea', {cols:60, rows:15, spellcheck:false, oninput:(e:any) => {
				e.redraw = false
				man.qry = (e.srcElement as HTMLTextAreaElement).value
			}}, man.qry),
			m('', m('button[type=submit]', 'Run')),
			man.res ? m('textarea', {cols:60, rows:15, disabled:true}, man.res) : null
		)
	}
}
