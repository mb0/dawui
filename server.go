package dawui

import (
	"log"
	"net/http"
	"strings"

	"xelf.org/daql/cmd"
	"xelf.org/daql/hub"
	"xelf.org/daql/hub/wshub"
	"xelf.org/daql/qry"
	"xelf.org/xelf/exp"
	"xelf.org/xelf/lib/extlib"
)

type Server struct {
	Dir    string
	Data   string
	Proj   *cmd.Project
	Bend   qry.Backend
	hub    *hub.Hub
	hubsrv http.Handler
}

func NewServer(dir, data string) (*Server, error) {
	h := hub.NewHub(nil)
	res := &Server{Dir: dir, Data: data, hub: h, hubsrv: wshub.NewServer(h)}
	if dir != "" {
		pr, err := cmd.LoadProject(dir)
		if err != nil {
			return nil, err
		}
		res.Proj = pr
		if data != "" {
			d, err := cmd.OpenData(pr, data)
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

func (s *Server) query(m *hub.Msg) *hub.Msg {
	var raw string
	err := m.Unmarshal(&raw)
	if err != nil {
		return m.ReplyErr(err)
	}
	log.Printf("got qry %s", raw)
	el, err := exp.Read(s.Proj.Reg, strings.NewReader(raw), "input")
	if err != nil {
		return m.ReplyErr(err)
	}
	q := qry.New(s.Proj.Reg, extlib.Std, s.Bend)
	l, err := q.ExecExp(nil, el, nil)
	if err != nil {
		return m.ReplyErr(err)
	}
	return m.Reply(l)
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	const root = "/home/mb0/work/dawui"
	switch path := r.URL.Path; path {
	case "/favicon.ico":
		http.Error(w, "not found", http.StatusNotFound)
	case "/dist/main.bundle.js", "/dist/main.bundle.js.map":
		http.ServeFile(w, r, root+path)
	case "/hub":
		s.hubsrv.ServeHTTP(w, r)
	default:
		http.ServeFile(w, r, root+"/dist/main.html")
	}
}
