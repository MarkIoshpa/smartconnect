#include "Root.h"

// Receives serial input from workstation, and writes it to buffer
// Returns true if workstation finishes sending message, else returns false
bool Root::receiveWorkstationRequest(byte* buffer)
{
  static int i = 0, length = 0;

  // If 1st byte received, set length
  if(Serial.available() > 0 && length == 0)
  {
    buffer[i] = Serial.read();
    length = buffer[i];
    i++;
  }
  else
  {
    // Write to buffer until length
    while(length > 0 && i < BUFF_SIZE && (Serial.available() > 0))
    {
      buffer[i] = Serial.read();
      i++;
          
      if(i == length)
      {
          // Reset static variables
          length = 0;
          i = 0;
          return true;
      }
    }
  }

  return false;
}

// Sends buffer to workstation, amount specified by package length byte
void Root::sendWorkstationResponse(byte* buffer)
{
  Serial.write(buffer, buffer[PACKAGE_LENGTH_OFFSET]);
}
