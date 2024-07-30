export async function connectToBACDevice(): Promise<
  BluetoothRemoteGATTCharacteristic | undefined
> {
  try {
    const device = await (navigator as any).bluetooth.requestDevice({
      filters: [{ services: ["your-device-service-uuid"] }],
    });

    const server = await device.gatt?.connect();
    if (!server) return;

    const service = await server.getPrimaryService("your-device-service-uuid");
    const characteristic = await service.getCharacteristic(
      "your-device-characteristic-uuid"
    );

    return characteristic;
  } catch (error) {
    console.error("Bluetooth connection failed", error);
  }
}
