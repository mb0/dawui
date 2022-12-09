package dawui

import (
	"bytes"
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strings"

	"xelf.org/daql"
	"xelf.org/daql/hub"
	"xelf.org/daql/hub/wshub"
	"xelf.org/daql/qry"
	"xelf.org/xelf/exp"
	"xelf.org/xelf/lib/extlib"
	"xelf.org/xelf/lit"
	"xelf.org/xelf/typ"
)

//go:embed dist
var distFS embed.FS

type Server struct {
	Dir    string
	Data   string
	Proj   *daql.Project
	Bend   qry.Backend
	fssrv  http.Handler
	hub    *hub.Hub
	hubsrv http.Handler
}

func NewServer(dir, data, static string) (*Server, error) {
	h := hub.NewHub(nil)
	var dist fs.FS = distFS
	if static != "" {
		dist = os.DirFS(static)
	}
	res := &Server{Dir: dir, Data: data,
		fssrv: http.FileServer(http.FS(dist)),
		hub:   h, hubsrv: wshub.NewServer(h),
	}
	if dir != "" {
		pr, err := daql.LoadProject(dir)
		if err != nil {
			return nil, err
		}
		res.Proj = pr
		if data != "" {
			d, err := qry.Open(pr.Project, data)
			if err != nil {
				return nil, err
			}
			res.Bend = d.Backend
		}
	}
	go h.Run(res)
	return res, nil
}
func (s *Server) Route(m *hub.Msg) {
	switch m.Subj {
	case hub.Signon:
		m.From.Chan() <- &hub.Msg{Subj: "hello", Data: s.Proj.Record}
	case hub.Signoff:
	case "qry":
		m.From.Chan() <- s.query(m)
	default:
		log.Printf("unexpected message %s", m.Subj)
	}
}

type queryRes = struct {
	Res lit.Val  `json:"res"`
	Typ typ.Type `json:"typ"`
}

func (s *Server) query(m *hub.Msg) *hub.Msg {
	var raw string
	err := m.Unmarshal(&raw)
	if err != nil {
		return m.ReplyErr(err)
	}
	el, err := exp.Read(strings.NewReader(raw), "input")
	if err != nil {
		return m.ReplyErr(err)
	}
	q := qry.New(s.Proj.Reg, extlib.Std, s.Bend)
	v, err := q.ExecExp(nil, el, nil)
	if err != nil {
		return m.ReplyErr(err)
	}
	return m.Reply(queryRes{v, v.Type()})
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if strings.HasPrefix(r.URL.Path, "/dist/") {
		s.fssrv.ServeHTTP(w, r)
		return
	}
	switch path := r.URL.Path; path {
	case "/favicon.ico":
		http.Error(w, "not found", http.StatusNotFound)
	case "/hub":
		s.hubsrv.ServeHTTP(w, r)
	default:
		raw, _ := distFS.ReadFile("dist/main.html")
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Header().Set("Content-Length", fmt.Sprint(len(raw)))
		bytes.NewReader(raw).WriteTo(w)
	}
}
