import m from 'mithril'
import {Component} from 'mithril'
import {EditorState, basicSetup} from '@codemirror/basic-setup'
import {EditorView, ViewUpdate, keymap} from '@codemirror/view'
import {indentWithTab} from '@codemirror/commands'
import {LanguageSupport, LRLanguage, foldNodeProp, foldInside, indentNodeProp} from '@codemirror/language'
import {styleTags, tags} from '@codemirror/highlight'
import {parser} from './xelf'

const foldAfter = (n:any) => {
	let fst = n.firstChild, lst = n.lastChild;
	if (!fst || fst.to >= lst.from) return null
	let start = fst.nextSibling || fst
	return {from: start.to, to: lst.type.isError ? n.to : lst.from }
}
const parserWithMetadata = parser.configure({
	props: [
		styleTags({
			Null: tags.null,
			Bool: tags.bool,
			Num: tags.number,
			Char: tags.character,
			Sym: tags.name,
			"()": tags.paren,
			"{}": tags.brace,
			"[]": tags.bracket,
			"<>": tags.angleBracket,
		}),
		indentNodeProp.add({
			"Idxr Keyr Tupl": context => context.column(context.node.from) + context.unit
		}),
		foldNodeProp.add({"Idxr Keyr": foldInside}),
		foldNodeProp.add({"Tupl": foldAfter}),
	]
})
const xelfLang = new LanguageSupport(LRLanguage.define({parser: parserWithMetadata}), [])

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
				basicSetup, xelfLang,
				keymap.of([indentWithTab]),
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
