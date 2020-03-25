#include "Master.h"
#include "Slave.h"

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

// Microcontroller State
enum State { Idle, Working};

// Global Variables

Master MasterWire = Master(); // I2c Master Wire
Slave SlaveWire = Slave();    // I2C Slave Wire
byte buffer[BUFF_SIZE];       // Buffer for messages between master and slave
int requestAddress;           // Address of slave that the message should be sent to
byte errorByte;               // Error byte when sending request to slave
state = Idle;                 // Starting state

// Setup
void setup() 
{
  Serial.begin(9600);
  BoardConfiguration.setup();
  MasterWire.setup();
  SlaveWire.setup(receiveEvent, requestEvent);
}

// Slave - Receive from master Event
void receiveEvent(int bytes) 
{
  state = Working;
}

// Slave - Request from master Event
void requestEvent()
{
  SlaveWire.sendResponse(buffer);
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
    readDevice();
    break;

  case WRITE_DEVICE:
    writeDevice();
    break;
  
  default:
    break;
  }
}

// Operation for reading configuration data, prepares response buffer
void getConfigData()
{
  int i;

  buffer[COMPLETECODE_OFFSET] = SUCCESS;
  buffer[DATA_LENGTH_OFFSET] = 2 + DESCRIPTION_LENGTH + DEVICE_NUMBER*3;
  buffer[PACKAGE_LENGTH_OFFSET] = 4 + buffer[DATA_LENGTH_OFFSET]; // 4 bytes for checksum data length, completion code and package length.
  buffer[DATA_OFFSET + ADDRESS_ID] = BoardConfiguration.getId();
  buffer[DATA_OFFSET + ADDRESS_MAX_SLAVE] = BoardConfiguration.getMaxSlaveAddress();
  
  for(i = 0; i < DESCRIPTION_LENGTH; i++)
    buffer[DATA_OFFSET+ADDRESS_DESC+i] = (BoardConfiguration.getDescription())[i];
  
  for(i = 0; i < DEVICE_NUMBER; i++)
  {
    buffer[DATA_OFFSET+DESCRIPTION_LENGTH+i*3] = (BoardConfiguration.getDeviceData())[i].address;
    buffer[DATA_OFFSET+DESCRIPTION_LENGTH+i*3+1] = (BoardConfiguration.getDeviceData())[i].pinmode;
    buffer[DATA_OFFSET+DESCRIPTION_LENGTH+i*3+2] = (BoardConfiguration.getDeviceData())[i].type;
  }

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
      temp.pinmode = buffer[configDataOffset + 2];
      temp.type = (DeviceType) buffer[configDataOffset + 3];
      error = BoardConfiguration.setDeviceDataElement(temp, temp.address);

      // Set pinmode for new device if necessary
      if(temp.type == DigitalSensor || temp.type == AnalogSensor)
      {
        pinMode(temp.address, temp.pinmode);
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

// Operation for reading data from sensor, prepares response buffer with data
void readDevice()
{
  byte deviceAddressOffset = buffer[PACKAGE_LENGTH_OFFSET] - 2;
  enum DeviceType type = BoardConfiguration.getDeviceData()[buffer[deviceAddressOffset]].type;
  int result;

  switch (type)
  {
  case DigitalSensor:
    buffer[COMPLETECODE_OFFSET] = SUCCESS;
    buffer[PACKAGE_LENGTH_OFFSET] = 5;
    buffer[DATA_LENGTH_OFFSET] = 1;
    buffer[DATA_OFFSET] = digitalRead(buffer[deviceAddressOffset]);
    break;

  case AnalogSensor:
    result = analogRead(buffer[deviceAddressOffset]);
    buffer[COMPLETECODE_OFFSET] = SUCCESS;
    buffer[PACKAGE_LENGTH_OFFSET] = 6;
    buffer[DATA_LENGTH_OFFSET] = 2;
    buffer[DATA_OFFSET] = (byte)result;           // 1st byte of result
    buffer[DATA_OFFSET+1] = (byte)(result >> 8);  // 2nd byte of result
    break;
  
  default:
    buffer[PACKAGE_LENGTH_OFFSET] = 4;
    buffer[COMPLETECODE_OFFSET] = FAILED;
    buffer[DATA_LENGTH_OFFSET] = 0;
    break;
  }
  
  buffer[buffer[PACKAGE_LENGTH_OFFSET]-1] = checksum();
}

// Operation for writing data to actuator, prepares response buffer
void writeDevice()
{
  byte deviceAddressOffset = ADDRESS_OFFSET + 1;
  int value1 = buffer[buffer[PACKAGE_LENGTH_OFFSET]-2];
  int value2 = buffer[buffer[PACKAGE_LENGTH_OFFSET]-1];
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
      sum += buffer[i];  
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
  return buffer[ADDRESS_OFFSET];
}

// Main Loop
void loop() 
{
  switch(state)
  {
    case Idle:
      break;

    case Working:
      // Received a request from a master
      SlaveWire.receiveRequest(buffer);

      // Check if checksum is correct
      if(checksumError())
      {
        state = Idle;
        break;
      }   

      if(buffer[ADDRESS_LENGTH_OFFSET] == 1) // Operation designated for this microcontroller
      {
        // Execute operation and wait until master requests to send result
        executeOperation();
      }
      else  // Operation designated for a microcontroller lower in the hierarchy
      {
        // Request slave to perform operation
        requestAddress = findNextSlaveAddress();
        buffer[buffer[PACKAGE_LENGTH_OFFSET]-1] = checksum();
        errorByte = MasterWire.sendRequest(buffer, requestAddress);
        
        if(errorByte)
        {
          requestError();
        }
        else
        {
          // Request a response from the slave to get back result
          MasterWire.requestResponse(buffer, requestAddress);
          MasterWire.receiveResponse(buffer);

          // Check if checksum is correct
          checksumError();
        }
      }
      // Change state back to idle
      state = Idle;
      break;
  }
}
