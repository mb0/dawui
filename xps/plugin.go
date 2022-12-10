package main

import (
	"flag"
	"log"
	"net/http"

	"xelf.org/daql"
	"xelf.org/daql/qry"
	"xelf.org/daql/xps/prov"
	"xelf.org/dawui"
	"xelf.org/xelf/xps"
)

func Cmd(ctx *xps.CmdCtx) error {
	var addr, data, static string
	flags := flag.NewFlagSet("dawui", flag.ExitOnError)
	flags.StringVar(&addr, "addr", "localhost:8090", "specify the webui server http address")
	flags.StringVar(&data, "data", "", "a specific dataset to use")
	flags.StringVar(&static, "static", "", "alternative location for static assets")
	err := flags.Parse(ctx.Args)
	if err != nil {
		return err
	}
	pr, err := daql.LoadProject(ctx.Dir)
	if err != nil {
		return err
	}
	var bend qry.Backend
	if data != "" {
		plugBends := prov.NewPlugBackends(&ctx.Plugs)
		bend, err = plugBends.Provide(data, pr.Project)
		if err != nil {
			return err
		}
	}
	srv, err := dawui.NewServer(ctx.Dir, pr, bend, static)
	if err != nil {
		return err
	}
	log.Printf("open server at http://%s", addr)
	return http.ListenAndServe(addr, srv)
}
