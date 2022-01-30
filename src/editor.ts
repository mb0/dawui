import m from 'mithril'
import {Component} from 'mithril'
import {EditorState, basicSetup} from "@codemirror/basic-setup"
import {EditorView, ViewUpdate} from "@codemirror/view"

interface Man {
	qry:string
	editor?:EditorView
}

export const Editor:Component<{man:Man},{ed:EditorView}> = {
	oncreate({attrs:{man}, dom, state}) {
		if (!man.qry) man.qry = `(?prod.prod)`
		state.ed = new EditorView({parent:dom, state: EditorState.create({
			doc: man.qry,
			extensions: [
				basicSetup,
				EditorView.updateListener.of((v:ViewUpdate) => {
					if (v.docChanged) {
						man.qry = v.state.doc.toString()
					}
				}),
			],
		})})
	},
	onremove({state:{ed}}) {
		if (ed) ed.destroy()
	},
	view({}) {
		return m('')
	}
}
