const SerialPort = require('serialport');
const Mutex = require('async-mutex').Mutex;
const withTimeout = require('async-mutex').withTimeout;
const consts = require('./consts');

var comport = JSON.parse(localStorage.getItem("comport"))
var serialPort = new SerialPort(comport, {baudRate: 9600})
const mutexWithTimeout = withTimeout(new Mutex(), 1000, new Error('timeout'));
var ready = false
serialPort.setMaxListeners(0)


class Microcontroller {
    constructor(id, maxSlaveAddress, desc, path, devices) {
        this.id = id
        this.maxSlaveAddress = maxSlaveAddress
        this.desc = desc
        this.path = path
        this.devices = devices
        this.children = []
    }
    

    async setMaxSlaveAddress(value) {
        let result = await sendMessage(consts.SET_CONFIGURATION, this.path, 0, [value])

        if(result[consts.COMPLETECODE_OFFSET] === consts.SUCCESS)
            this.maxSlaveAddress = value

        return result[consts.COMPLETECODE_OFFSET]
    }

    async setDescription(desc) {
        let data = []

        for(let i = 0; i < desc.length; i++)
            data.push(desc.charAt(i))

        let result = await sendMessage(consts.SET_CONFIGURATION, this.path, 1, data)

        if(result[consts.COMPLETECODE_OFFSET] === consts.SUCCESS)
            this.desc = desc

        return result[consts.COMPLETECODE_OFFSET]
    }

    async setDevice(data) {
        let result = await sendMessage(consts.SET_CONFIGURATION, this.path, 2, [data.address, data.type])
        if(result[consts.COMPLETECODE_OFFSET] === consts.SUCCESS)
        {
            let found = false
            this.devices.forEach(device => {
                if(device.address === data.address)
                {
                    device.type = data.type
                    found = true
                }
            })
            if(!found) {
                let tmp = { id: data.id, type: data.type}
                this.devices.push(tmp)
            }
        }

        return result[consts.COMPLETECODE_OFFSET]
    }

    async getSensorData() {
        let result =  await sendMessage(consts.GET_SENSORDATA, this.path)
        let array = []
        let time = 0
        let data = {}

        if(result[consts.COMPLETECODE_OFFSET] === consts.SUCCESS)
        {
            for(let i = 0; i < result[consts.DATA_LENGTH_OFFSET]; i+=2)
                array.push(result[consts.DATA_OFFSET+i] + (result[consts.DATA_OFFSET+i+1] << 8))
            for(let i = 0; i < 4; i++)
                time += result[result[consts.PACKAGE_LENGTH_OFFSET]-5+i] << (8*i)
            
            data.time = time
        }
        else // return negative value indicating error
            array.push(-result[consts.COMPLETECODE_OFFSET])

        data.array = array
        return data
    }

    async setActuatorData(address, value) {
        let data = [value, value >> 8]

        let result =  await sendMessage(consts.SET_ACTUATORDATA, this.path, address, data)

        return result[consts.COMPLETECODE_OFFSET]
    }
}

serialPort.on('data', function(data) {
    if(!ready)
    {
        ready = true
    }
})

serialPort.on('close', function() { 
    ready = false
    let interval = setInterval(()=> {
        serialPort.open()
        if(ready) {
            clearInterval(interval)
        }
    },1000);
 })

async function getConfiguration(path) {
    return await sendMessage(consts.GET_CONFIGURATION, path)
}

async function getAllBoardConfiguration() {
    let results = []
    let buffer = await getConfiguration([0])
    if(buffer[consts.COMPLETECODE_OFFSET] === consts.SUCCESS)
    {
        let microcontroller = createMicrocontroller(buffer, [0])
        results.push(microcontroller)
        await scan(results, microcontroller)
    }

    return results
}

async function scan(results, microcontroller)
{
    for(let i = 1; i < microcontroller.maxSlaveAddress; i++)
    {
        let newPath = microcontroller.path.concat(i)
        let buffer = await getConfiguration(newPath)

        if(buffer[consts.COMPLETECODE_OFFSET] === consts.SUCCESS)
        {
            let newMicrocontroller = createMicrocontroller(buffer, newPath)
            results.push(newMicrocontroller)
            microcontroller.children.push(newMicrocontroller)
            await scan(results, newMicrocontroller)
        }
    }
}

function createMicrocontroller(buffer, path) {
    let devices = [], tmp = []
    let descriptionLength = buffer[consts.DATA_OFFSET+2]

    for(let i = 0; i < descriptionLength ; i++) 
        tmp.push(buffer[consts.DATA_OFFSET+3+i])
    
    let deviceOffset = consts.DATA_OFFSET+2+descriptionLength+1
    for(let i = 0; i < buffer[deviceOffset]; i+=2)
        devices.push({ id: buffer[deviceOffset+i+1], type: buffer[deviceOffset+i+2]})

    return new Microcontroller(buffer[consts.DATA_OFFSET], buffer[consts.DATA_OFFSET+1], String.fromCharCode(...tmp), path, devices)
}

var sendMessage = async function(opcode, path, address = -1, data = []) {
    let buffer = initMessage(opcode, path, address, data)

    await mutexWithTimeout
        .acquire()
        .then(async (release) => {
            serialPort.write(buffer)
            buffer = Buffer.alloc(0)    

            await new Promise((resolve, reject) => {
                let length = 0, i = 0
                serialPort.on('data', (data) => {
                    if(length === 0)
                        length = data[0]

                    buffer = Buffer.concat([buffer, data])
                    if(i >= Math.floor(length / (consts.SERIAL_BUFFER_SIZE+1)))
                        resolve()
                    i++
                })
            })

            release()
        }, (error) => buffer = Buffer.from([[4, 8, 0, 12]]))

    return buffer
}

function initMessage(opcode, path, address = -1, data = []) {
    let buffer, packetLength

    if(address === -1)
        packetLength = path.length + 4
    else
        packetLength = path.length + 5 + data.length

    buffer = Buffer.alloc(packetLength)
    buffer[consts.PACKAGE_LENGTH_OFFSET] = packetLength
    buffer[consts.OPCODE_OFFSET] = opcode
    buffer[consts.ADDRESS_LENGTH_OFFSET] = path.length

    for(let i = 0; i < path.length; i++)
        buffer[consts.ADDRESS_OFFSET+i] = path[i]

    if(address !== 0)
        buffer[3 + path.length] = address

    for(let i = 0; i < data.length; i++)
     buffer[i + 4 + path.length] = data[i]

    buffer[packetLength-1] = checksum(buffer)

    return buffer
}

function checksum(buffer) {
    let sum, i
    for( i = 0, sum = 0; i < buffer[consts.PACKAGE_LENGTH_OFFSET]-1; i++)
      sum += buffer[i];  
    
    return sum % 256
}

module.exports.getAllBoardConfiguration = getAllBoardConfiguration
module.exports.isReady = () => {return ready}