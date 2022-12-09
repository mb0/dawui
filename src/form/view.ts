import {h, H} from '../h'
import {Form, Field, Layout, FormElem} from 'daql/form/form'
import {renderField} from './widg'

const renderElem = (el:FormElem):H => {
	if (el instanceof Layout) {
		return h('details', h('summary', el.meta.label || 'Group'),
			el.elems.map(e => renderElem(e)),
		)
	} else if (el instanceof Form) {
		return h('', 'Form '+ el.id,
			el.elems.map(e => renderElem(e)),
		)
	}
	return renderField(el.meta, el)
}

export function defaultFormat(v:any):string {
	if (typeof v === "object") {
		return JSON.stringify(v)
	}
	return v+""
}

export const formView = (form:Form) => ()=> {
	const fields = Object.keys(form.fields).map(k => form.fields[k])
	return labeledFields(fields)()
}

export const labeledFields = (fields:Field[]) => ()=> {
	return h('table', fields.map(f =>  h('tr',
		h('td', h('label', {htmlFor:f.id}, f.label())),
		h('td', renderField(f.meta, f)),
	)))
}
