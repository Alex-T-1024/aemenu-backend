function exitHandler(options, eventName, err) {
  console.log(`Exit event: ${eventName}`)
  if (err) {
    console.error(err.stack)
  }
  if(options.safeExit) {
    console.log('Safe exited.')
  }
  if (options.cleanup) {
    // Not working on Windows
    // console.log('Cleaning before exiting...')
    console.log('Not clean up!')
  }
  if (options.ctrl_c) {
    console.log('Ctrl+C catched!')
  }
}

var cleanUpArray = []
function addCleanUp(/*func, func2...*/) {
  for (let i = 0; i < arguments.length; i++) {
    if (arguments[i] === safeExit) continue
    if (typeof arguments[i] === 'function') {
      cleanUpArray.push(arguments[i])
    }
    else console.error('Arguments must be function(s)!!')
  }
}

function safeExit() {
  chainPromise(cleanUpArray, 0).finally(() => {
    process.exit()
  })
}

function chainPromise(arr, index) {
  let result = wrap2Promise(arr[index]())
  if (arr.length - 1 === index) {
    return result
  }
  return result.finally(() => chainPromise(arr, index + 1))
}

function wrap2Promise(obj) {
  if (obj instanceof Promise) {
    return obj
  }
  return Promise.resolve().then(() => obj)
}

// Safe exit when safeExit() triggered.
process.on('exit', exitHandler.bind(null, { safeExit: true }, 'exit'))

// Catches Ctrl+C event
process.on('SIGINT', exitHandler.bind(null, { cleanup: true, ctrl_c: true }, 'SIGINT'))

// Catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { cleanup: true }, 'SIGUSR1'))
process.on('SIGUSR2', exitHandler.bind(null, { cleanup: true }, 'SIGUSR2'))

// Catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { cleanup: true }, 'uncaughtException'))

export { addCleanUp, safeExit }
