import m from 'mithril'
import {hub, hubUrl} from './hub'
import {Man} from './ctx'
import {Schema, Model} from './model'
import {IndexView, SchemaView, ModelView, DetailView, QueryView} from './views'

hub.connect(hubUrl('/hub'))

const man:Man = new Man()

hub.on("hello", (subj, data) => {
	man.init(data)
	m.redraw()
})

m.route.prefix = ''
let app = document.getElementById('app')
m.route(app!, '/', {
	'/': {view() {
		if (!man.done) return m('h1', "loading...")
		const pr = man.ctx.proj
		if (!pr) return m('h1', `Project not found`)
		return [man.nav(),
			m(IndexView, {man, pr}),
			m(QueryView, {man}),
		]
	}},
	'/:schema': {view({attrs:{schema}}) {
		if (!man.done) return m('h1', "loading...")
		const s = man.ctx.map[schema] as Schema|null
		if (!s) return m('h1', `Schema ${schema} not found`)
		return [man.nav(s.name),
			m(SchemaView, {man, s}),
			m(QueryView, {man}),
		]
	}},
	'/:schema/:model': {view({attrs:{schema, model}}) {
		if (!man.done) return m('h1', "loading...")
		const mod = man.ctx.map[schema+"."+model] as Model|null
		if (!mod) return m('h1', `Model ${model} not found`)
		return [man.nav(mod.schema, mod.name),
			m(ModelView, {man, mod}),
			m(QueryView, {man}),
		]
	}},
	'/:schema/:model/:key': {view({attrs:{schema, model, key}}) {
		if (!man.done) return m('h1', "loading...")
		man.key = key
		const mod = man.ctx.map[schema+"."+model] as Model|null
		if (!mod) return m('h1', `Model ${model} not found`)
		return [man.nav(mod.schema, mod.name),
			m(DetailView, {man, mod}),
			m(QueryView, {man}),
		]
	}},
})
