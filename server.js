const path = require('path');
const fetch = require('node-fetch')
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');

dotenv.config({ path: './config/config.env' });
const transactions = require('./router/transactions');
const connectDb = require('./config/db');

connectDb();
const app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use('/api/v1/transactions', transactions);

function isPrime(num) {
    for (var i = 2; i < num; i++)
        if (num % i === 0) return false;
    return num > 1;
}
function isPrimePromise(num) {
    return new Promise(function (resolve, reject) {
        if (num === 1) reject(false)
        for (var i = 2; i < num; i++) {
            if (num % i === 0) {
                reject(false);
            }
        }
        resolve(true);
    })
}

function callApi(i) {

    return new Promise(function (resolve, reject) {
        fetch(`https://jsonplaceholder.typicode.com/posts/${i}`)
            .then(result => result.json())
            .then(body => resolve(body))
            .catch(error => reject(error));

    })

}

app.get('/test', (req, res) => {
    let promiseArray = []
    for (let i = 1; i <= 10; i++) {
        promiseArray.push(callApi(i))
    }
    Promise.all(promiseArray)
        .then(responses => res.json({ resolve: responses }))
        .catch(error => res.json({
            reject: error
        }))

    // let num = 5
    // // const result = isPrime(num)
    // // res.json(result)
    // isPrimePromise(num)
    //     .then(result =>
    //         res.json({
    //             resolve: result
    //         }))
    //     .catch(error =>
    //         res.json({ reject: error })
    //     )
})



if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on port: ${PORT}`.yellow.bold));