import hub from './hub'
import {Node, Project, Schema, Model, ProjectOpt, makeProject, makeSchema} from './dom'
import {Version} from './mig'
import {scan} from 'xelf/ast'
import {Type, parseType} from 'xelf/typ'

export interface Ctx {
	proj?:Project
	map:{[name:string]:Node}
}

export interface QryRes {
	res?:any
	typ?:Type
	err?:string
}

interface InitData extends ProjectOpt {
	manifest?:Version[]
}

export class Man {
	ctx:Ctx = {map:{}}
	done = false
	key = ""
	qry = ""
	res?:QryRes
	constructor() {}
	init(data:InitData) {
		this.done = true
		const proj = makeProject(data)
		proj.schemas.push(makeSchema({name: "dom", models: [
			{name:"Schema", elems:[
				{name:"Name", type:"<str>"},
				{name:"Models", type:"<list|@dom.Model>"},
			]},
			{name:"Model", elems:[
				{name:"Kind", type:"<typ>"},
				{name:"Name", type:"<str>"},
				{name:"Schema", type:"<str>"},
				{name:"Elems", type:"<list|@dom.Elem>"},
			]},
		]}))
		this.ctx.proj = proj
		this.ctx.map['_'+proj.name] = proj
		proj.schemas.forEach((s:Schema) => {
			this.ctx.map[s.name] = s
			if (s.models) s.models.forEach((m:Model) => this.ctx.map[m.qname] = m)
		})
		if (data.manifest) data.manifest.forEach((v:Version) => {
			let n = this.ctx.map[v.name]
			if (n) n.vers = v.vers
		})
	}
	async query(qry:string) {
		scan(qry)
		let data = await hub.request("qry", qry)
		if (typeof data.typ == "string") {
			data.typ = parseType(scan(data.typ))
		}
		this.res = data
		return this.res
	}
	completions() {
		let res:any[] = []
		if (this.ctx.proj) this.ctx.proj.schemas.forEach(s => {
			s.models.forEach(m => {
				res.push({label:m.qname.toLowerCase(), type:"namespace"})
			})
		})
		return res
	}
}
