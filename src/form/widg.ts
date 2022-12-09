import {h, H} from '../h'
import {knd, typ} from 'xelf/typ'
import {Field, FieldMeta} from 'daql/form'

export type Widget = (f:Field)=>H

export const renderField = (fm:FieldMeta, f:Field):H =>  widgetFor(fm)(f)

export const widgetFor = (fm:FieldMeta):Widget => {
	if (fm.widg) return fm.widg
	return fm.widg = defaultWidgets[fm.typ.kind&knd.data] || rawWidget
}

export const rawWidget:Widget = (f:Field) => {
	const edit = (e:any) => {f.edit(e.target.value)}
	return h('.widg',
		h('input', {type:"text", id:f.id, name:f.meta.key,
			value:f.val, onchange:edit, oninput:edit,
		}),
		h('', typ.toStr(f.meta.typ)),
	)
}

export const boolWidget:Widget = (f:Field) => {
	const onclick = (e:any) => {f.edit(e.target.checked)}
	return h('input.widg', {type:"checkbox", id:f.id, name:f.meta.key,
		checked:f.val, onclick,
	})
}

export const textWidget:Widget = (f:Field) => {
	const edit = (e:any) => {f.edit(e.target.value)}
	return h('input.widg', {type:"text", id:f.id, name:f.meta.key,
		value:f.val, onchange:edit, oninput:edit,
	})
}

export const intWidget:Widget = (f:Field) => {
	const edit = (e:any) => {f.edit(parseInt(e.target.value, 10))}
	return h('input.widg', {type:"text", id:f.id, name:f.meta.key,
		value:f.val||'', onchange:edit, oninput:edit,
	})
}
export const realWidget:Widget = (f:Field) => {
	const edit = (e:any) => {f.edit(parseFloat(e.target.value))}
	return h('input.widg', {type:"text", id:f.id, name:f.meta.key,
		value:f.val||'', onchange:edit, oninput:edit,
	})
}

export const uuidWidget:Widget = (f:Field) => {
	const edit = (e:any) => {f.edit(e.target.value)}
	return h('input.widg', {type:"text", id:f.id, name:f.meta.key,
		value:f.val, onchange:edit, oninput:edit,
	})
}

export const spanWidget:Widget = (f:Field) => {
	const edit = (e:any) => {f.edit(e.target.value)}
	return h('input.widg', {type:"text", id:f.id, name:f.meta.key,
		value:f.val, onchange:edit, oninput:edit,
	})
}

export const timeWidget:Widget = (f:Field) => {
	const edit = (e:any) => {f.edit(e.target.value)}
	return h('input.widg', {type:"text", id:f.id, name:f.meta.key,
		value:f.val, onchange:edit, oninput:edit,
	})
}

export let defaultWidgets:{[key:number]:Widget} = {
	0x0100: boolWidget,
	0x0200: intWidget,
	0x0400: realWidget,
	0x0800: intWidget,   // bits
	0x1000: textWidget,
	0x2000: rawWidget,
	0x4000: uuidWidget,
	0x8000: spanWidget,
	0x10000: timeWidget,
	0x20000: textWidget, // enum
	0x40000: rawWidget,  // list
	0x80000: rawWidget,  // dict
	0x100000: rawWidget, // obj
}

