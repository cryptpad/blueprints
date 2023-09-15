const { test } = require('@playwright/test')
const fs = require('fs')

test('Run benchmarks', async ({ page, browserName }) => {
    const benchmarkPromise = new Promise(resolve => {
        page.on('console', async message => {
            if (message.text() === 'Benchmark suite complete.') {
                // if the suite has finished, we're done
                resolve()
            } else if (message.type() === 'info') {
                const filename = process.env.STARTTIME + '_' + browserName + '.json'
                const dir = 'data/'
                fs.mkdir(dir, { recursive: true }, function (err) { if (err) throw err })

                const path = dir + filename
                console.log(filename)
                fs.writeFile(path, message.text(), function (err) {
                    if (err) throw err
                    console.log('File was saved.')
                })
            } else if (message.type() === 'warning') {
                // Workaround for Webkit
                console.log('[Warning:]' + message.text())
            } else {
                console[message.type()](message.text())
            }
        })
    })

    await page.goto(`file://${process.cwd()}/bench.html`, { timeout: 0 })
    await benchmarkPromise
})
