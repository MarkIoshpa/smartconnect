#ifndef Configuration_h
#define Configuration_h

#include <EEPROM.h>

// Definitions

#define DEVICE_NUMBER 16
#define DESCRIPTION_LENGTH 64
#define ADDRESS_ID 0
#define MAX_SLAVE_ADDRESS 1
#define ADDRESS_DESC 2
#define ADDRESS_DEVICES DESCRIPTION_LENGTH+ADDRESS_DESC

// Device Type enum
enum DeviceType { None, Sensor, Actuator };

// Device Data struct

struct DeviceData
{
  byte address;
  byte pinmode;
  enum DeviceType type;
};

class Configuration
{
public:
  void setup();
  byte getId();
  bool setId(byte id);
  byte getMaxSlaveAddress();
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

