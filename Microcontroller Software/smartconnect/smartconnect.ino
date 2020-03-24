#include "Master.h"
#include "Slave.h"

// I2C Master/Slave Wires

Master MasterWire = Master();
Slave SlaveWire = Slave();

// State Enumeration

enum State { Idle, Working};
State state = Idle;

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

// Buffer for messages between master and slave
byte buffer[BUFF_SIZE];

// Address of slave that the message should be sent to
int requestAddress;

// Setup
void setup() 
{
  Serial.begin(9600);
  BoardConfiguration.setup();
  MasterWire.setup();
  SlaveWire.setup(receiveEvent, requestEvent);

  Serial.print(F("Microcontroller ID: "));
  Serial.println(BoardConfiguration.getId());
  Serial.print(F("Description: "));
  Serial.println(BoardConfiguration.getDescription());
}

// Slave - Receive from master Event
void receiveEvent(int bytes) 
{
  state = ReceiveRequestFromMaster;
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

void getConfigData()
{
  int i;

  buffer[COMPLETECODE_OFFSET] = SUCCESS;
  buffer[DATA_LENGTH_OFFSET] = 2 + DESCRIPTION_LENGTH + DEVICE_NUMBER*3;
  buffer[PACKAGE_LENGTH_OFFSET] = 3 + buffer[DATA_LENGTH_OFFSET]; // 3 bytes for data length, completion code and package length.
  buffer[DATA_OFFSET + ADDRESS_ID] = BoardConfiguration.getId();
  buffer[DATA_OFFSET + ADDRESS_MAX_SLAVE] = BoardConfiguration.getMaxSlaveAddress();
  
  for(i = 0; i < DESCRIPTION_LENGTH; i++)
    buffer[DATA_OFFSET+ADDRESS_DESC+i] = (BoardConfiguration.getDescription())[i];
  
  for(i = 0; i < DEVICE_NUMBER; i++)
  {
    buffer[DATA_OFFSET+DESCRIPTION_LENGTH+i] = (BoardConfiguration.getDeviceData())[i].address;
    buffer[DATA_OFFSET+DESCRIPTION_LENGTH+i] = (BoardConfiguration.getDeviceData())[i].pinmode;
    buffer[DATA_OFFSET+DESCRIPTION_LENGTH+i] = (BoardConfiguration.getDeviceData())[i].type;
  }
}

void setConfigData()
{

}

void readDevice()
{

}

void writeDevice()
{

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

      if(buffer[ADDRESS_LENGTH_OFFSET] == 1) // Operation designated for this microcontroller
      {
        // Execute operation and wait until master requests to send result
        executeOperation();
      }
      else  // Operation designated for a microcontroller lower in the hierarchy
      {
        // Request slave to perform operation
        requestAddress = findNextSlaveAddress();
        MasterWire.sendRequest(buffer, requestAddress);
        
        // Request a response from the slave to get back result
        MasterWire.requestResponse(buffer, requestAddress);
        MasterWire.receiveResponse(buffer);


      }
      // Change state back to idle
      state = Idle;
      break;
  }
}
