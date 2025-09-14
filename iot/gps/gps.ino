#define RXPin 16
#define TXPin 17

HardwareSerial gpsSerial(2);

void setup() {
  Serial.begin(115200);
  gpsSerial.begin(9600, SERIAL_8N1, RXPin, TXPin);
  Serial.println("Raw GPS data:");
}

void loop() {
  while (gpsSerial.available()) {
    char c = gpsSerial.read();
    Serial.write(c);  // forward directly to Serial Monitor
  }
}
