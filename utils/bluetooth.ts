export async function connectToBACDevice(): Promise<
  BluetoothRemoteGATTCharacteristic | undefined
> {
  try {
    const device = await (navigator as any)?.bluetooth.requestDevice({
      // filters: [{ services: ["your-device-service-uuid"] }],
      filters: [{ name: 'SmartBreathalyzer' }],
      optionalServices: ['battery_service']
    });


    const server = await device.gatt?.connect();
    if (!server) return;

    const service = await server.getPrimaryService('battery_service');
    const characteristic = await service.getCharacteristic('battery_level');

    console.log('Bluetooth Info: ', server, service, characteristic)
    return characteristic.readValue().getUint8(0);
  } catch (error) {
    console.error("Bluetooth connection failed", error);
  }
}
