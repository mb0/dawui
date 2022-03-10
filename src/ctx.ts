import hub from './hub'
import {Version, Node, Project, Schema, Model, Elem} from './model'
import {scan} from 'xelf/ast'
import {Type, parseType} from 'xelf/typ'

export interface Ctx {
	proj?:Project
	map:{[name:string]:Node}
}

const addModel = (ctx:Ctx, m:Model) => {
	m.key = m.name.toLowerCase()
	m.qname = m.schema+'.'+m.name
	ctx.map[m.qname] = m
	if (m.elems) m.elems.forEach((e:Elem) => {
		e.key = (e.name||'').toLowerCase()
	})
}

export interface QryRes {
	res?:any
	typ?:Type
	err?:string
}

export class Man {
	ctx:Ctx = {map:{}}
	done = false
	key = ""
	qry = ""
	res?:QryRes
	constructor() {}
	init(data:any) {
		this.done = true
		this.ctx.proj = data
		if (data.name) this.ctx.map['_'+data.name] = data
		if (data.schemas) data.schemas.forEach((s:Schema) => {
			this.ctx.map[s.name] = s
			if (s.models) s.models.forEach((m:Model) => addModel(this.ctx, m))
		})
		if (data.manifest) data.manifest.forEach((v:Version) => {
			let n = this.ctx.map[v.name]
			if (n) n.vers = v.vers
		})
		let doms:Schema = {name: "dom", vers:"", models: [
			{name:"Schema", qname:"", vers:"", key:"", schema:"dom", kind:"<obj>", elems:[
				{name:"Name", key:"", type:"<str>"},
				{name:"Models", key:"", type:"<list|@dom.Model>"},
			]},
			{name:"Model", qname:"", vers:"", key:"", schema:"dom", kind:"<obj>", elems:[
				{name:"Kind", key:"kind", type:"<typ>"},
				{name:"Name", key:"name", type:"<str>"},
				{name:"Schema", key:"schema", type:"<str>"},
				{name:"Elems", key:"elems", type:"<list|@dom.Elem>"},
			]},
		]}
		this.ctx.map["dom"] = doms
		doms.models.forEach((m:Model) => addModel(this.ctx, m))
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
}
