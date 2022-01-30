import m from 'mithril'
import {hub, hubUrl} from './hub'
import {Man} from './ctx'
import {Schema, Model} from './model'
import {Layout, IndexView, SchemaView, ModelView, DetailView, QueryView} from './views'

hub.connect(hubUrl('/hub'))

const man:Man = new Man()

hub.on("hello", (_, data) => {
	man.init(data)
	m.redraw()
})

m.route.prefix = ''
let app = document.getElementById('app')
m.route(app!, '/', {
	'/': {render() {
		return m(Layout, {man, path: []},
			m(IndexView, {man}),
		)
	}},
	'/:schema': {render({attrs:{schema}}) {
		return m(Layout, {man, path: [schema]},
			m(SchemaView, {man, node:schema}),
		)
	}},
	'/:schema/:model': {render({attrs:{schema, model}}) {
		const node = schema +'.'+ model
		return m(Layout, {man, path: [schema, model]},
			m(ModelView, {man, node}),
		)
	}},
	'/:schema/:model/:key': {render({attrs:{schema, model}}) {
		const node = schema +'.'+ model
		return m(Layout, {man, path: [schema, model]},
			m(DetailView, {man, node}),
		)
	}},
})
