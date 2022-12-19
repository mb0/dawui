import {indexView, schemaView, modelView} from './views/dom'
import {h} from './h'
import {hub, hubUrl} from 'daql/hub'
import {app} from './app'
import {Man} from './ctx'
import {router as r} from './rout'
import {layout} from './views/layout'

document.querySelector("#app")!.replaceChildren(app.el)
hub.connect(hubUrl('/hub'))
const man:Man = new Man()

hub.on("hello", (_, data) => {
	man.init(data)
	app.redraw()
})
r.addAll({
	'/': () => app.mount(layout(man,
		[], indexView(man)
	)),
	'/*': (schema:string) => app.mount(layout(man,
		[schema], schemaView(man, schema)
	)),
	'/*/*': (schema:string, model:string) => app.mount(layout(man,
		[schema, model], modelView(man, schema+'.'+model)
	)),
	'/*/*/*': (...args:string[]) => app.mount(layout(man,
		args, ()=> h('p', 'entry '+args.join('.'))
	)),
})
r.start('/', true)
