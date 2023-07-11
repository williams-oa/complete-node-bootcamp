const fs = require('fs')
const http = require('http')
const url = require('url')
const replaceTemplate = require('./1-node-farm/modules/replacetemplate')



//--------------------------------------------------------------------------------------------
//FILES

//Blocking, synchronous way
// const newText = fs.readFileSync('./1-node-farm/starter/txt/input.txt', 'utf-8')
// console.log(newText)
// const writeText = `This is what we know about the avocado: ${newText}.\n Created on ${Date()}`
// fs.writeFileSync('./1-node-farm/starter/txt/output.txt', writeText)
// console.log('file written') 

//Non-blocking, asynchronous way
// fs.readFile('./1-node-farm/starter/txt/starrt.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('ERROR!!')

//     fs.readFile(`./1-node-farm/starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         fs.readFile(`./1-node-farm/starter/txt/append.txt`, 'utf-8', (err, data3) => {
//             fs.writeFile('./1-node-farm/starter/txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('your file has been written')
//             } )
//         })
//     })
// })
// console.log('please wait while reading file')


//--------------------------------------------------------------------------------------------
//SERVER
const tempOverview = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/1-node-farm/starter/templates/template-product.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/1-node-farm/starter/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

const server = http.createServer((request, response) => {
    
    const { query, pathname } = url.parse(request.url, true)
    


 //overview page   
    if (pathname === '/' || pathname === '/overview') {
        response.writeHead(200, {'content-type': 'text/html'})

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el))
        const output = tempOverview.replace('{%product_cards%}', cardsHtml)
        response.end(output)


//product page
    } else if (pathname === '/product') {
        response.writeHead(200, {'content-type': 'text/html'})
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)
        response.end(output)

//API
    } else if (pathname ==='/api') {
       
        response.writeHead(200, {'content-type': 'application/json'})
        response.end(data)
        }

//Not found
     else {
        response.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        })
        response.end('<h1>Page cannot be found!</h1>')
    }
})

server.listen(8000, '127.0.0.1', ()=> {
    console.log('Listening on port 8000')
})