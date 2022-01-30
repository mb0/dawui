import hub from './hub'
import {Version, Node, Project, Schema, Model, Elem} from './model'
import {scan} from 'xelf/ast'

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
	async query(qry:string) {
		try {
			scan(qry)
			const res = await hub.request("qry", qry)
			this.res = JSON.stringify(res)
			return res
		} catch (e:any) {
			this.res = e.message
			throw e
		}
	}
}
