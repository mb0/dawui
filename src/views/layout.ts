import {Man} from '../ctx'
import {queryView} from './query'
import {h, H, P, V} from '../h'
import {param} from '../rout'

export const layout = (man:Man, path:string[], comp:V):V => () => {
	if (!man.done) return h('.dawui', h('h1', "loading..."))
	let href = ''
	const isQuery = param('view') == 'query'
	const links = path.reduce((a, part:string, i:number) => {
		href += '/' + part
		const disabled = i == path.length-1 && !isQuery
		a.push(' > ', link({href, disabled}, part))
		return a
	}, [
		link({href: '?view=query', disabled: isQuery}, 'Query'),
		' | ',
		link({href:'/'}, man.ctx.proj?.name||'no project'),
	])
	return h('.dawui',
		h('nav', links),
		h('section', comp()),
		queryView(man)(),
	)
}

export function link(p:P, name:string):H {
	return h('a.link', p, name)
}
