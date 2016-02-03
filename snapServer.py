from BaseHTTPServer import BaseHTTPRequestHandler
import cgi
import urlparse, subprocess
import httplib, urllib

class PostHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        try:
            f = open("hello_dao.txt") #open requested file
            #print self.headers
            #send code 200 response
            self.send_response(200)

            #send header first
            self.send_header('Content-type','text-html')
            self.end_headers()

            #send file content to client
            self.wfile.write(f.read())
            #f.close()


            #sniffing_process = subprocess.Popen(["./a.out", command], stderr=subprocess.PIPE, stdout=subprocess.PIPE)
            #stdout, sterr = sniffing_process.communicate()
            print stdout
            return
        except:
            pass

    def do_POST(self):
        # Begin the response
     

        return

if __name__ == '__main__':
    from BaseHTTPServer import HTTPServer
    server = HTTPServer(('192.168.1.15', 8000), PostHandler)
    print 'Starting server, use <Ctrl-C> to stop'
    server.serve_forever()