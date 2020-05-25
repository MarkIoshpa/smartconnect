#include "Configuration.h"

// Reads all values from EEPROM
void Configuration::setup()
{
  int i;
  struct DeviceData tempDeviceData; 

  // Load microcontroller id
  microcontrollerid = EEPROM.read(ADDRESS_ID);

  // Load max slave address
  maxSlaveAddress = EEPROM.read(ADDRESS_MAX_SLAVE);

  // Load description from EEPROM
  for(i = 0; i < DESCRIPTION_LENGTH; i++)
    description[i] = (char) EEPROM.read(ADDRESS_DESC + i);

  // Load Device Data from EEPROM
  for(i = 0; i < DEVICE_NUMBER; i++)
  {
    tempDeviceData.address = EEPROM.read(ADDRESS_DEVICES + i*2);
    tempDeviceData.type = (enum DeviceType) EEPROM.read(ADDRESS_DEVICES + i*2 + 1);
    deviceData[i] = tempDeviceData;

    if(deviceData[i].type == DigitalSensor)
    {
      pinMode(deviceData[i].address, INPUT);
    }

    if(deviceData[i].type == DigitalActuator)
    {
      pinMode(deviceData[i].address, OUTPUT);
    }
  }
}

// Getters and Setters for Configuration Data //////////////////////////////////////////////////////////////

byte Configuration::getId()
{
  return microcontrollerid;
}

bool Configuration::setId(byte id)
{
  // I2C address range between 1 and 127
  if(id < 1 || id > 127)
    return false;

  microcontrollerid = id;
  EEPROM.write(ADDRESS_ID, id);

  return true;
}

byte Configuration::getMaxSlaveAddress()
{
  return maxSlaveAddress;
}

bool Configuration::setMaxSlaveAddress(byte address)
{
  // I2C address range between 1 and 127
  // if 0 then microcontroller is only a slave
  // and not a master
  if(address > 127)
    return false;

  maxSlaveAddress = address;
  EEPROM.write(ADDRESS_MAX_SLAVE, address);

  return true;
}

char* Configuration::getDescription()
{
  return description;
}

bool Configuration::setDescription(const char* desc)
{
  int i;

  // desc buffer must be of appropriate length
  if(sizeof(desc) != DESCRIPTION_LENGTH)
    return false;

  for(i = 0; i < DESCRIPTION_LENGTH; i++)
    description[i] = desc[i];

  // Write description to EEPROM
  for(i = 0; i < DESCRIPTION_LENGTH; i++)
    EEPROM.write(ADDRESS_DESC+i, desc[i]);

  return true;
}

DeviceData* Configuration::getDeviceData()
{
  return deviceData;
}

bool Configuration::setDeviceDataElement(DeviceData data, int index)
{
  // index must be between 0 and max number of devices
  if(index < 0 || index >= DEVICE_NUMBER)
    return false;

  deviceData[index] = data;

  // Write devicedata to EEPROM
  EEPROM.write(ADDRESS_DEVICES + index*2, deviceData[index].address);
  EEPROM.write(ADDRESS_DEVICES + index*2 + 1, deviceData[index].type);

  return true;
}

Configuration BoardConfiguration = Configuration();
