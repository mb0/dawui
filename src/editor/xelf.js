// This file was generated by lezer-generator. You probably shouldn't edit it.
import {LRParser} from "@lezer/lr"
export const parser = LRParser.deserialize({
  version: 14,
  states: "%|QVQPOOOtQPO'#CdO!dQPO'#CgO!kQPO'#CtO#lQPO'#CuO$mQPO'#CjOOQO'#Cu'#CuO$xQPO'#CoOOQO'#Ct'#CtO%PQPO'#CsQOQPOOOOQO,59O,59OO%WQPO,59OO%]QPO'#CvOOQO,59R,59RO%dQPO,59RO{QPO,59VOOQO,59V,59VO%iQPO'#CkO%qQPO'#CxOOQO,59U,59UO%|QPO,59UOOQO,59Z,59ZO&RQPO,59ZOOQO,59_,59_OVQPO,59_OOQO1G.j1G.jOOQO,59b,59bO{QPO,59bOOQO1G.m1G.mOOQO1G.q1G.qOOQO,59d,59dO&WQPO,59dOOQO1G.p1G.pOOQO1G.u1G.uOOQO1G.y1G.yOOQO1G.|1G.|OOQO1G/O1G/O",
  stateData: "&`~OfOS~OQUORUOSUOTSOVPOYQO]TO`RObVO~OUZO~PVOQUORUOSUOTUOVPOYQO]TO~OX^O~P{Om`OnaOQhXRhXShXThXVhXYhX]hX`hXbhXkhXdhXUhXahX~Om`OnaOQiXRiXSiXTiXViXYiX]iX`iXbiXkiXdiXUiXaiX~OTbO[dO`bO~OafO~PVOkiO~PVOUjO~OklO~P{OXmO~Om`OnaO~OTbO`bOkpO~O[qO~OarO~OTbO`bO~O",
  goto: "#amPPPPPPPPnPPnPPnyPPP!ZPPP!b!k!v#ZP#^cUOPQVX]`ilYWOPVXiQcTQocRupZWOPVXiQYOQ[PRgVUXOPVQhXRsiYWOPVXiQ]QQk]Qn`RtlR_QReT",
  nodeNames: "⚠ Doc Null Bool Num Char > < Typ ] [ Idxr } { Keyr Tag Sym ) ( Tupl",
  maxTerm: 30,
  nodeProps: [
    ["openedBy", 6,"<",9,"[",12,"{",17,"("],
    ["closedBy", 7,">",10,"]",13,"}",18,")"]
  ],
  skippedNodes: [0],
  repeatNodeCount: 0,
  tokenData: "Eg~RzXY#uYZ#u]^#upq#uqr$Wrs%bst$Wtu$Wuv$Wvw$Wwx'Uxy(syz(xz{$W{|$W|}(}}!O)S!O!P$W!P!Q$W!Q!R3w!R![5V![!]5h!]!^5m!^!_5r!_!`$W!`!a5w!a!b$W!c!}$W!}#O5|#P#Q6R#R#S$W#S#T6W#T#Y$W#Y#Z6p#Z#b$W#b#c=]#c#h$W#h#iBk#i#o$W#o#pE]#q#rEb$g##l$W~#zSf~XY#uYZ#u]^#upq#u~$]a`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|$W}!O$W!O!P$W!P!Q$W!Q![$W!_!`$W!a!b$W!c!}$W#R#S$W#T#o$W$g##l$W~%eWOY%bZr%brs%}s#O%b#O#P&S#P;'S%b;'S;=`'O<%lO%b~&SOT~~&VRO;'S%b;'S;=`&`;=`O%b~&cXOY%bZr%brs%}s#O%b#O#P&S#P;'S%b;'S;=`'O;=`<%l%b<%lO%b~'RP;=`<%l%b~'XWOY'UZw'Uwx%}x#O'U#O#P'q#P;'S'U;'S;=`(m<%lO'U~'tRO;'S'U;'S;=`'};=`O'U~(QXOY'UZw'Uwx%}x#O'U#O#P'q#P;'S'U;'S;=`(m;=`<%l'U<%lO'U~(pP;=`<%l'U~(xOb~~(}Oa~~)SOk~~)Xb`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|$W}!O$W!O!P$W!P!Q$W!Q!R*a!R![2_!_!`$W!a!b$W!c!}$W#R#S$W#T#o$W$g##l$W~*heS~`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|$W}!O$W!O!P+y!P!Q$W!Q![$W!_!`$W!a!b$W!c!g$W!g!h.m!h!}$W#R#S$W#T#X$W#X#Y.m#Y#o$W$g##l$W~,Oa`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|$W}!O$W!O!P$W!P!Q$W!Q![-T!_!`$W!a!b$W!c!}$W#R#S$W#T#o$W$g##l$W~-[eS~`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|$W}!O$W!O!P$W!P!Q$W!Q![-T!_!`$W!a!b$W!c!g$W!g!h.m!h!}$W#R#S$W#T#X$W#X#Y.m#Y#o$W$g##l$W~.ra`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|/w}!O/w!O!P$W!P!Q$W!Q![1R!_!`$W!a!b$W!c!}$W#R#S$W#T#o$W$g##l$W~/|a`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|$W}!O$W!O!P$W!P!Q$W!Q![1R!_!`$W!a!b$W!c!}$W#R#S$W#T#o$W$g##l$W~1YaS~`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|$W}!O$W!O!P$W!P!Q$W!Q![1R!_!`$W!a!b$W!c!}$W#R#S$W#T#o$W$g##l$W~2feS~`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|$W}!O$W!O!P+y!P!Q$W!Q![2_!_!`$W!a!b$W!c!g$W!g!h.m!h!}$W#R#S$W#T#X$W#X#Y.m#Y#o$W$g##l$W~3|RS~!O!P4V!g!h4k#X#Y4k~4YP!Q![4]~4bRS~!Q![4]!g!h4k#X#Y4k~4nR{|4w}!O4w!Q![4}~4zP!Q![4}~5SPS~!Q![4}~5[SS~!O!P4V!Q![5V!g!h4k#X#Y4k~5mOm~~5rOn~~5wOV~~5|OU~~6ROY~~6WOX~~6ZTO#S6W#S#T%}#T;'S6W;'S;=`6j<%lO6W~6mP;=`<%l6W~6ub`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|$W}!O$W!O!P$W!P!Q$W!Q![$W!_!`$W!a!b$W!c!}$W#R#S$W#T#U7}#U#o$W$g##l$W~8Sc`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|$W}!O$W!O!P$W!P!Q$W!Q![$W!_!`$W!a!b$W!c!}$W#R#S$W#T#`$W#`#a9_#a#o$W$g##l$W~9dc`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|$W}!O$W!O!P$W!P!Q$W!Q![$W!_!`$W!a!b$W!c!}$W#R#S$W#T#g$W#g#h:o#h#o$W$g##l$W~:tc`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|$W}!O$W!O!P$W!P!Q$W!Q![$W!_!`$W!a!b$W!c!}$W#R#S$W#T#X$W#X#Y<P#Y#o$W$g##l$W~<WaR~`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|$W}!O$W!O!P$W!P!Q$W!Q![$W!_!`$W!a!b$W!c!}$W#R#S$W#T#o$W$g##l$W~=bc`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|$W}!O$W!O!P$W!P!Q$W!Q![$W!_!`$W!a!b$W!c!}$W#R#S$W#T#i$W#i#j>m#j#o$W$g##l$W~>rc`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|$W}!O$W!O!P$W!P!Q$W!Q![$W!_!`$W!a!b$W!c!}$W#R#S$W#T#`$W#`#a?}#a#o$W$g##l$W~@Sc`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|$W}!O$W!O!P$W!P!Q$W!Q![$W!_!`$W!a!b$W!c!}$W#R#S$W#T#`$W#`#aA_#a#o$W$g##l$W~AfaQ~`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|$W}!O$W!O!P$W!P!Q$W!Q![$W!_!`$W!a!b$W!c!}$W#R#S$W#T#o$W$g##l$W~Bpc`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|$W}!O$W!O!P$W!P!Q$W!Q![$W!_!`$W!a!b$W!c!}$W#R#S$W#T#f$W#f#gC{#g#o$W$g##l$W~DQc`~qr$Wst$Wtu$Wuv$Wvw$Wz{$W{|$W}!O$W!O!P$W!P!Q$W!Q![$W!_!`$W!a!b$W!c!}$W#R#S$W#T#i$W#i#j:o#j#o$W$g##l$W~EbO]~~EgO[~",
  tokenizers: [0],
  topRules: {"Doc":[0,1]},
  tokenPrec: 0
})