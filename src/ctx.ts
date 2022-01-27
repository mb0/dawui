import m from 'mithril'
import hub from './hub'
import {Version, Node, Project, Schema, Model, Elem} from './model'

export interface Ctx {
	proj?:Project
	map:{[name:string]:Node}
}

export class Man {
	ctx:Ctx = {map:{}}
	done = false
	key = ""
	qry = ""
	res = ""
	constructor() {}
	init(data:any) {
		this.done = true
		this.ctx.proj = data
		if (data.name) this.ctx.map['_'+data.name] = data
		if (data.schemas) data.schemas.forEach((s:Schema) => {
			this.ctx.map[s.name] = s
			if (s.models) s.models.forEach((m:Model) => {
				m.key = m.name.toLowerCase()
				m.qname = m.schema+'.'+m.name
				this.ctx.map[m.qname] = m
				if (m.elems) m.elems.forEach((e:Elem) => {
					e.key = (e.name||'').toLowerCase()
				})
			})
		})
		if (data.manifest) data.manifest.forEach((v:Version) => {
			let n = this.ctx.map[v.name]
			if (n) n.vers = v.vers
		})
	}
	nav(...parts:string[]) {
		const isQuery = m.route.param("view") == 'query'
		let href = ''
		return m('nav', parts.reduce((a, part:string, i:number) => {
			href += '/' + part
			const disabled = i == parts.length-1 && !isQuery
			a.push(' > ', m(m.route.Link, {href, disabled}, part))
			return a
		}, [
			m(m.route.Link, {href:'?view=query', disabled: isQuery}, 'Query'),
			' | ',
			m(m.route.Link, {href:'/'}, this.ctx.proj!.name),
		]))
	}
	query(qry:string) {
		hub.request("qry", qry).then(res => {
			this.res = JSON.stringify(res)
			m.redraw()
		})
	}
}
