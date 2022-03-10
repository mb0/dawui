import m from 'mithril'
import {Component} from 'mithril'
import {EditorState, basicSetup} from '@codemirror/basic-setup'
import {EditorView, ViewUpdate, keymap} from '@codemirror/view'
import {indentWithTab} from '@codemirror/commands'
import {LanguageSupport, LRLanguage, foldNodeProp, foldInside, indentNodeProp} from '@codemirror/language'
import {styleTags, tags} from '@codemirror/highlight'
import {completeFromList} from "@codemirror/autocomplete"
import {parser} from './xelf'

const foldAfter = (n:any) => {
	let fst = n.firstChild, lst = n.lastChild;
	if (!fst || fst.to >= lst.from) return null
	let start = fst.nextSibling || fst
	return {from: start.to, to: lst.type.isError ? n.to : lst.from }
}
const xelfLang = LRLanguage.define({
	parser: parser.configure({
		props: [
			styleTags({
				Null: tags.null,
				Bool: tags.bool,
				Num: tags.number,
				Char: tags.character,
				Sym: tags.variableName,
				"( )": tags.paren,
				"{ }": tags.brace,
				"[ ]": tags.squareBracket,
				"< >": tags.angleBracket,
			}),
			indentNodeProp.add({
				"Idxr Keyr Tupl": context => context.column(context.node.from) + context.unit
			}),
			foldNodeProp.add({"Idxr Keyr": foldInside}),
			foldNodeProp.add({"Tupl": foldAfter}),
		]
	}),
	languageData: {
		closeBrackets: {brackets: ['(', '[', '{', '<', '"', "'", '`']}
	}
})

interface Man {
	qry:string
	completions():any[]
}

export const Editor:Component<{man:Man},{ed:EditorView}> = {
	oncreate({attrs:{man}, dom, state}) {
		if (!man.qry) man.qry = `(*dom.model asc:schema asc:name lim:50 _:(.schema '.' .name))`
		const xelf = new LanguageSupport(xelfLang, [xelfLang.data.of({
			autocomplete: completeFromList(man.completions())
		})])
		state.ed = new EditorView({parent:dom, state: EditorState.create({
			doc: man.qry,
			extensions: [
				basicSetup, xelf,
				keymap.of([indentWithTab]),
				EditorState.tabSize.of(8),
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
