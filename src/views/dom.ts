import {h, V} from '../h'
import {typ} from 'xelf/typ'
import {Schema, Model} from 'daql/dom'
import {Man} from '../ctx'
import {formView, makeForm} from '../form'

export const indexView = (man:Man):V => ()=> {
	const pr = man.ctx.proj
	if (!pr) return h('h1', `Project not found`)
	return [h('h1', `Project ${pr.name}  ${pr.vers}`),
		h('ul', (pr.schemas||[]).map(s =>
			h('li', h('a', {href:`/${s.name}`}, s.name))
		)),
	]
}

export const schemaView = (man:Man, node:string):V => ()=> {
	const s = man.ctx.map[node] as Schema|null
	if (!s) return h('h1', `Schema ${node} not found`)
	return [h('h1', `Schema ${s.name} ${s.vers}`),
		h('ul', s.models.map(mod =>
			h('li', h('a', {href:`/${s.name}/${mod.name}`}, mod.name))
		)),
	]
}

export const modelView = (man:Man, node:string):V => ()=> {
	const mod = man.ctx.map[node] as Model|null
	if (!mod) return h('h1', `Model ${node} not found`)
	return [h('h1', `Model ${mod.name} ${mod.vers}`),
		h('details', h('summary', "Model Details"),
			h('ul', mod.elems.map(el => h('li', el.name, ' ', typ.toStr(el.type)))),
		),
	]
}

export const detailView = (man:Man, node:string):V => ()=> {
	const model = man.ctx.map[node] as Model|null
	if (!model) return h('h1', `Model ${node} not found`)
	const form = makeForm({}, {model})
	form.init({name:"test"})
	const view = formView(form)
	return [h('h1', `Model ${model.name} Detail ${man.key||''}`),
		h('form', {onsubmit:(e:Event) => e.preventDefault()},
			view(),
			h('button', 'Save'),
		),
	]
}
