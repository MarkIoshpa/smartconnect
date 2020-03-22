#include "Master.h"
#include "Slave.h"

// I2C Master/Slave Wires
Master MasterWire = Master();
Slave SlaveWire = Slave();

// State Enumeration
enum State { Idle, ReceiveRequestFromMaster, SendRequestToSlave, RequestResponseFromSlave, ReceiveResponseFromSlave};
State state = Idle;

// Operation Code Definitions
#define GET_CONFIG_DATA 1
#define SET_CONFIG_DATA 2
#define READ_DEVICE 3
#define WRITE_DEVICE 4

// Buffer for messages between master and slave
byte buffer[BUFF_SIZE];

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

  buffer[COMPLETECODE_OFFSET] = 0;
  buffer[DATA_LENGTH_OFFSET] = 1 + DESCRIPTION_LENGTH + DEVICE_NUMBER*3;
  buffer[PACKAGE_LENGTH_OFFSET] = 3 + buffer[DATA_LENGTH_OFFSET]; // 3 bytes for data length, completion code and package length.
  buffer[DATA_OFFSET] = BoardConfiguration.getId();
  
  for(i = 0; i < DESCRIPTION_LENGTH; i++)
    buffer[DATA_OFFSET+1+i] = (BoardConfiguration.getDescription())[i];
  
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

// Main Loop
void loop() 
{
  switch(state)
  {
    case Idle:
      break;

    case ReceiveRequestFromMaster:
      Serial.println(F("Receieve Request from master !"));
      SlaveWire.receiveRequest(buffer);
      if(buffer[ADDRESS_OFFSET+buffer[ADDRESS_LENGTH_OFFSET]-1] == BoardConfiguration.getId())
      {
        Serial.println(F("Executing Operation!"));
        executeOperation();
      }
      else
      {
        state = SendRequestToSlave; 
      }
      break;

    case SendRequestToSlave:
      Serial.println(F("Send request to slave!"));
      MasterWire.sendRequest(buffer);
      state = RequestResponseFromSlave;
      break;

    case RequestResponseFromSlave:
      Serial.println(F("Request response from slave!"));
      MasterWire.requestResponse(buffer);
      state = ReceiveResponseFromSlave;
      break;

    case ReceiveResponseFromSlave:
      Serial.println(F("Receieve response from slave!"));
      MasterWire.receiveResponse(buffer);
      state = Idle;
      for(int i = 0; i < BUFF_SIZE; i++)
      {
        Serial.print(i);
        Serial.print(" - ");
        Serial.print(buffer[i], HEX);
        Serial.println("");
      }
      break;
  }
}

