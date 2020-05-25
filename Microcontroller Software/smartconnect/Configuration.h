#ifndef Configuration_h
#define Configuration_h

#include <Arduino.h>
#include <EEPROM.h>

// Definitions

#define DEVICE_NUMBER       16  // Maximum number of devices
#define DESCRIPTION_LENGTH  64  // Maximum size of description

// Definition of 

#define ADDRESS_ID          0
#define ADDRESS_MAX_SLAVE   1
#define ADDRESS_DESC        2
#define ADDRESS_DEVICES     DESCRIPTION_LENGTH+ADDRESS_DESC

// Device Type enum
enum DeviceType { None, DigitalSensor, DigitalActuator, AnalogSensor, AnalogActuator };

// Device Data struct

struct DeviceData
{
  byte address;
  enum DeviceType type;
};

class Configuration
{
public:
  void setup();
  byte getId();
  bool setId(byte id);
  byte getMaxSlaveAddress();
  bool setMaxSlaveAddress(byte address);
  char* getDescription();
  bool setDescription(const char* desc);
  DeviceData* getDeviceData();
  bool setDeviceDataElement(DeviceData data, int index); 

private:
  byte microcontrollerid;
  byte maxSlaveAddress;
  char description[DESCRIPTION_LENGTH];
  struct DeviceData deviceData[DEVICE_NUMBER];
};

extern Configuration BoardConfiguration;

#endif // Configuration_h
