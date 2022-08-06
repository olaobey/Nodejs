// const amount = 12;
// if (amount < 10) {
//   console.log("small number");
// } else {
//   console.log("Big number");
// }
// console.log(`Hey this is my first node app!!`);

// setInterval(() => {
//   console.log("Hello World");
// }, 1000);

// Blocking, synchronous way
// Module is treated as file in Node.js.
const fs = require("fs");
const http = require("http");
const { parse } = require("path");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./Modules/replaceTemplate");

// FILES
// const textIn = fs.readFileSync("./text/input.txt", "utf-8");
// console.log(textIn);
// const textOut = `This is what we know about avocado: ${textIn}.\ncreated on ${Date.now()}`;
// fs.writeFileSync("./text/output.txt", textOut);
// console.log("File written successfully");

// Non-Blocking, asynchronous way
// fs.readFile("./text/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./text/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./text/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile(
//         "./text/final.txt",
//         `${data2}\n${data3}\n${Date.now()}`,
//         "utf-8",
//         (err) => {
//           console.log("Your file has been written successfully.");
//         }
//       );
//     });
//   });
// });
// console.log("Will read file!");

// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const slug = dataObj.map((el) => slugify(el.productName, { lower: true }));
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // OVERVIEW
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
    // PRODUCT
  } else if (pathname === "/product") {
    res.writeHead(200, { "content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);
    // NOT FOUND
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-own-header": "Hello world!",
    });
    res.end("<h1>Page not found</h1>");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000!");
});
