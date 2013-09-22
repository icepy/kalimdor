from http.server import HTTPServer, CGIHTTPRequestHandler
port = 8086
httpd = HTTPServer(('', port), CGIHTTPRequestHandler)
httpd.serve_forever()