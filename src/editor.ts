import m from 'mithril'
import {Component} from 'mithril'
import {EditorState, basicSetup} from "@codemirror/basic-setup"
import {EditorView, ViewUpdate} from "@codemirror/view"

interface Man {
	qry:string
	editor?:EditorView
}

export const Editor:Component<{man:Man}> = {
	oncreate({attrs:{man}, dom}) {
		if (!man.qry) man.qry = `(?prod.prod)`
		let state = man.editor ? man.editor.state : EditorState.create({doc: man.qry, extensions: [
			basicSetup,
			EditorView.updateListener.of((v:ViewUpdate) => {
				if (v.docChanged) {
					man.qry = v.state.doc.toString()
				}
			}),
		]})
		man.editor = new EditorView({state, parent:dom})
	},
	view({}) {
		return m('')
	}
}
