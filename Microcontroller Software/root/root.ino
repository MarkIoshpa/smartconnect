#include "Root.h"
#include "Master.h"
#include "Slave.h"
#include <avr/wdt.h>

// Operation Code Definitions

#define GET_CONFIG_DATA 1
#define SET_CONFIG_DATA 2
#define READ_DEVICE     3
#define WRITE_DEVICE    4

// Completion Code Definitions

#define SUCCESS       0
#define BUFFER_FULL   1
#define ADDRESS_NACK  2
#define DATA_NACK     3
#define OTHER         4
#define FAILED        5
#define CHECKSUM_ERR  6
#define INVALID_OP    7

// Global Variables

Root RootCommunication = Root();// Serial Communication with PC workstation
Master MasterWire = Master();   // I2c Master Wire
byte buffer[BUFF_SIZE];         // Buffer for messages between master and slave
int requestAddress;             // Address of slave that the message should be sent to
byte errorByte;                 // Error byte when sending request to slave
unsigned long startTime = 0;    // Loop start time

// Setup
void setup() 
{
  Serial.begin(9600);
  BoardConfiguration.setup();
  MasterWire.setup();
  wdt_enable(WDTO_8S);
  // Send ready byte
  Serial.write(0x00);
}

// Execute operation specified in request message
void executeOperation()
{
  int operationCode = buffer[OPCODE_OFFSET];
  switch (operationCode)
  {
  case GET_CONFIG_DATA:
    getConfigData();
    break;

  case SET_CONFIG_DATA:
    setConfigData();
    break;

  case READ_DEVICE:
    readDevices();
    break;

  case WRITE_DEVICE:
    writeDevice();
    break;
  
  default:
    errorByte = INVALID_OP;
    requestError();
    break;
  }
}

// Operation for reading configuration data, prepares response buffer
void getConfigData()
{
  int i, j, descLength, devicesLength, deviceOffset;

  buffer[COMPLETECODE_OFFSET] = SUCCESS;
  buffer[DATA_OFFSET + ADDRESS_ID] = BoardConfiguration.getId();
  buffer[DATA_OFFSET + ADDRESS_MAX_SLAVE] = BoardConfiguration.getMaxSlaveAddress();
  
  for(i = 0; i < DESCRIPTION_LENGTH && (BoardConfiguration.getDescription())[i] != 0; i++)
    buffer[DATA_OFFSET+ADDRESS_DESC+i+1] = (BoardConfiguration.getDescription())[i];

  descLength = i;
  buffer[DATA_OFFSET+ADDRESS_DESC] = descLength;
  deviceOffset = DATA_OFFSET+descLength+3;
  
  for(i = 0, j = 0; i < DEVICE_NUMBER; i++)
  {
    if((BoardConfiguration.getDeviceData())[i].type != None)
    {
      buffer[deviceOffset+j*2+1] = (BoardConfiguration.getDeviceData())[i].address;
      buffer[deviceOffset+j*2+2] = (BoardConfiguration.getDeviceData())[i].type;
      j++;
    }
  }

  devicesLength = j*2;
  buffer[deviceOffset] = devicesLength;

  buffer[DATA_LENGTH_OFFSET] = 4 + descLength + devicesLength;
  buffer[PACKAGE_LENGTH_OFFSET] = 4 + buffer[DATA_LENGTH_OFFSET]; // 4 bytes for checksum data length, completion code and package length.
  buffer[buffer[PACKAGE_LENGTH_OFFSET]-1] = checksum();
}

// Operation for setting configuration data, prepares response buffer
void setConfigData()
{
  byte configDataOffset = ADDRESS_LENGTH_OFFSET + buffer[ADDRESS_LENGTH_OFFSET] + 1;
  bool error;

  switch(buffer[configDataOffset]) // Configuration Data Type
  {
    case 0:
      error = BoardConfiguration.setMaxSlaveAddress(buffer[configDataOffset + 1]);
      break;

    case 1:
      char descBuffer[DESCRIPTION_LENGTH];
      // Copy description from message buffer to desc buffer
      for(int i = configDataOffset + 1, j = 0; i < buffer[PACKAGE_LENGTH_OFFSET] - 1; i++, j++)
        descBuffer[j] = buffer[i];
      error = BoardConfiguration.setDescription(descBuffer);
      break;

    case 2:
      DeviceData temp;
      temp.address = buffer[configDataOffset + 1];
      temp.type = (DeviceType) buffer[configDataOffset + 2];
      error = BoardConfiguration.setDeviceDataElement(temp, temp.address);

      // Set pinmode for new device if necessary
      if(temp.type == DigitalSensor)
      {
        pinMode(temp.address, INPUT);
      }

      if(temp.type == DigitalActuator)
      {
        pinMode(temp.address, OUTPUT);
      }
      break;
  }

  if(!error)
    buffer[COMPLETECODE_OFFSET] = SUCCESS;
  else
    buffer[COMPLETECODE_OFFSET] = FAILED;

  buffer[PACKAGE_LENGTH_OFFSET] = 4;
  buffer[DATA_LENGTH_OFFSET] = 0;
  buffer[buffer[PACKAGE_LENGTH_OFFSET]-1] = checksum();
}

// Operation for reading data from all sensors, prepares response buffer with data
void readDevices()
{
  enum DeviceType type;
  int result, i, j;
  unsigned long executeTime;

  for(i = 0, j = 0; i < DEVICE_NUMBER; i++)
  {
    type = BoardConfiguration.getDeviceData()[i].type;

    switch (type)
    {
    case DigitalActuator:
    case DigitalSensor:
      buffer[DATA_OFFSET+j*2] = digitalRead(i);
      buffer[DATA_OFFSET+1+j*2] = 0;
      j++;
      break;

    case AnalogActuator:
    case AnalogSensor:
      result = analogRead(i);
      buffer[DATA_OFFSET+j*2] = (byte)result;           // 1st byte of result
      buffer[DATA_OFFSET+1+j*2] = (byte)(result >> 8);  // 2nd byte of result
      j++; 
      break;
    
    default:
      continue;
      break;
    }
  }
  
  buffer[COMPLETECODE_OFFSET] = SUCCESS;
  buffer[PACKAGE_LENGTH_OFFSET] = 8+j*2;
  buffer[DATA_LENGTH_OFFSET] = j*2;
  executeTime = micros() - startTime;
  for(int k = 0; k < 4; k++)
    buffer[buffer[PACKAGE_LENGTH_OFFSET]-1-(4-k)] = executeTime >> k*8; // 4 bytes for unsigned long
  buffer[buffer[PACKAGE_LENGTH_OFFSET]-1] = checksum();
}

// Operation for writing data to actuator, prepares response buffer
void writeDevice()
{
  byte deviceAddressOffset = ADDRESS_OFFSET + 1;
  int value1 = buffer[buffer[PACKAGE_LENGTH_OFFSET]-3];
  int value2 = buffer[buffer[PACKAGE_LENGTH_OFFSET]-2];
  int value = value1 + (value2 << 8);
  enum DeviceType type = BoardConfiguration.getDeviceData()[buffer[deviceAddressOffset]].type;
  int result;

  switch (type)
  {
  case DigitalActuator:
    digitalWrite(buffer[deviceAddressOffset], value);
    buffer[COMPLETECODE_OFFSET] = SUCCESS;
    break;

  case AnalogActuator:
    analogWrite(buffer[deviceAddressOffset], value);
    buffer[COMPLETECODE_OFFSET] = SUCCESS;
    break;
  
  default:
    buffer[COMPLETECODE_OFFSET] = FAILED;
    break;
  }
  
  buffer[PACKAGE_LENGTH_OFFSET] = 4;
  buffer[DATA_LENGTH_OFFSET] = 0;
  buffer[buffer[PACKAGE_LENGTH_OFFSET]-1] = checksum();
}

// Checksum algorithm
byte checksum()
{
  unsigned int sum, i;
  for ( i = 0, sum = 0; i < buffer[PACKAGE_LENGTH_OFFSET]-1; i++)
  {
    sum += buffer[i];  
  }
  return (byte)(sum%256);
}

// Checks checksum, if error exists then sets buffer accordingly
bool checksumError()
{
  if(buffer[buffer[PACKAGE_LENGTH_OFFSET]-1] != checksum())
  {
    buffer[PACKAGE_LENGTH_OFFSET] = 4;
    buffer[COMPLETECODE_OFFSET] = CHECKSUM_ERR;
    buffer[DATA_LENGTH_OFFSET] = 0;
    buffer[buffer[PACKAGE_LENGTH_OFFSET]-1] = checksum();
    return true;
  } 
  return false;
}

// Sets buffer according to request error
void requestError()
{
  buffer[PACKAGE_LENGTH_OFFSET] = 4;
  buffer[COMPLETECODE_OFFSET] = errorByte;
  buffer[DATA_LENGTH_OFFSET] = 0;
  buffer[buffer[PACKAGE_LENGTH_OFFSET]-1] = checksum();
}

// Finds next address and deletes current one from buffer
int findNextSlaveAddress()
{
  // Delete current microcontroller's address by shifting buffer
  for(int i = ADDRESS_OFFSET; i < buffer[PACKAGE_LENGTH_OFFSET] - 1; i++)
    buffer[i] = buffer[i+1];
  buffer[PACKAGE_LENGTH_OFFSET] = buffer[PACKAGE_LENGTH_OFFSET] - 1;
  buffer[ADDRESS_LENGTH_OFFSET] = buffer[ADDRESS_LENGTH_OFFSET] - 1;
  buffer[buffer[PACKAGE_LENGTH_OFFSET]-1] = checksum();
  return buffer[ADDRESS_OFFSET];
}

// Main Loop
void loop() 
{
  startTime = micros();
  wdt_reset();
  // Received a request from a workstation
  if(RootCommunication.receiveWorkstationRequest(buffer))
  {
    // Check if checksum is correct
    if(checksumError())
    {
      // Send response back to PC workstation
      RootCommunication.sendWorkstationResponse(buffer);
      return;
    }   

    if(buffer[ADDRESS_LENGTH_OFFSET] == 1) // Operation designated for this microcontroller
    {
      executeOperation();
    }
    else  // Operation designated for a microcontroller lower in the hierarchy
    {
      // Request slave to perform operation
      requestAddress = findNextSlaveAddress();
      errorByte = MasterWire.sendRequest(buffer, requestAddress);

      if(errorByte)
      {
        requestError();
      }
      else
      {
        // Request a response from the slave to get back result
        do {
          MasterWire.requestResponse(buffer, requestAddress);
          MasterWire.receiveResponse(buffer);
        } while(buffer[PACKAGE_LENGTH_OFFSET] == 0); // poll slave until he's ready

        // Check if checksum is correct
        checksumError();
      }
    }

    // Send response back to PC workstation
    RootCommunication.sendWorkstationResponse(buffer);
  }
}
