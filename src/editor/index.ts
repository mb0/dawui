import {h} from '../h'
import {basicSetup} from 'codemirror'
import {EditorState} from '@codemirror/state'
import {EditorView, ViewUpdate, keymap} from '@codemirror/view'
import {indentWithTab} from '@codemirror/commands'
import {LanguageSupport, LRLanguage, foldNodeProp, foldInside, indentNodeProp} from '@codemirror/language'
import {styleTags, tags} from '@lezer/highlight'
import {completeFromList} from "@codemirror/autocomplete"
import {parser} from './xelf'

const foldAfter = (n:any) => {
	let fst = n.firstChild, lst = n.lastChild;
	if (!fst || fst.to >= lst.from) return null
	let start = fst.nextSibling || fst
	return {from: start.to, to: lst.type.isError ? n.to : lst.from }
}
const xelfLang = LRLanguage.define({
	parser: parser.configure({props: [
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
	]}),
	languageData: {
		closeBrackets: {brackets: ['(', '[', '{', '<', '"', "'", '`']}
	}
})

interface Man {
	qry:string
	completions():any[]
}

export const editor = (man:Man) => {
	if (!man.qry) man.qry = `(*dom.model asc:schema asc:name lim:50 _:(.schema '.' .name))`
	const xelf = new LanguageSupport(xelfLang, [
		xelfLang.data.of({autocomplete: completeFromList(man.completions())}),
	])
	let ed = new EditorView({state: EditorState.create({
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
	return () => h('div', {hook:{
		create: (_, n) => {
			(n.elm as HTMLElement).replaceChildren(ed.dom)
			return true
		},
		destroy: () => {
			if (ed) ed.destroy()
		}
	}})
}
