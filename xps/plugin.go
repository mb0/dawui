package main

import (
	"flag"
	"log"
	"net/http"

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
	srv, err := dawui.NewServer(ctx.Dir, data, static)
	if err != nil {
		return err
	}
	log.Printf("open server at http://%s", addr)
	return http.ListenAndServe(addr, srv)
}
