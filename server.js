const http = require('http');
const url = require('url');
const fs = require('fs');
const port = 8000;


http.createServer((req,res) => {
    const addr = req.url;
    const q = url.parse(addr, true);
    let filepath = '';
    const logString = `${new Date().toISOString()}\tURL:\t${q.pathname}\n`;

    fs.appendFile('log.txt',
        logString,
        (err) => {
            if (err) { console.log(err); }
            else { console.log(logString.trim()) }
        }
    );

    // This was originally q.pathname.includes()
    // includes() is too lax and allows for things like
    // /asdfdocumentationasdf which isn't preferable
    if (q.pathname === '/documentation') {
        filepath = (__dirname + '/documentation.html');
    } else {
        filepath = 'index.html';
    }

    fs.readFile(filepath, (err, data) => {
        if (err) {
            throw err;
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    })
}).listen(port);

console.log(`Server is listening on ${port}`);
