declare module "react-shimmer-effects";

declare module "react-media-capture";

declare module "@aws-sdk/client-s3";

declare module "@aws-sdk/client-rekognition";

declare module "@aws-sdk/client-cognito-identity";

declare module "@aws-sdk/credential-provider-cognito-identity";

declare module "crypto-js";

declare module "ml5";

interface BluetoothDevice {
  gatt?: BluetoothRemoteGATTServer;
}

interface BluetoothRemoteGATTServer {
  connect(): Promise<BluetoothRemoteGATTServer>;
  getPrimaryService(
    service: BluetoothServiceUUID
  ): Promise<BluetoothRemoteGATTService>;
}

interface BluetoothRemoteGATTService {
  getCharacteristic(
    characteristic: BluetoothCharacteristicUUID
  ): Promise<BluetoothRemoteGATTCharacteristic>;
}

interface BluetoothRemoteGATTCharacteristic extends EventTarget {
  startNotifications(): Promise<void>;
  stopNotifications(): Promise<void>;
  value?: DataView;
}

type BluetoothServiceUUID = number | string;
type BluetoothCharacteristicUUID = number | string;

declare module "p5" {
  export = p5;

  class p5 {
    setup: () => void;
    draw: () => void;
    mousePressed: () => void;
    frameCount: number;
    constructor(sketch: (p: p5) => void, node?: HTMLElement | string);
    createCanvas(width: number, height: number): p5.Renderer;
    createCapture(type: string): p5.Element;
    VIDEO: string;
    image(
      img: p5.Image,
      x: number,
      y: number,
      width?: number,
      height?: number
    ): void;
    get(x?: number, y?: number, w?: number, h?: number): p5.Image;
    noFill(): void;
    stroke(r: number, g: number, b: number): void;
    rect(x: number, y: number, w: number, h: number): void;
  }

  namespace p5 {
    interface Image {
      canvas: any;
      loadPixels(): void;
      pixels: number[];
      width: number;
      height: number;
    }
    interface Renderer {
      elt: HTMLCanvasElement;
      parent(arg0: HTMLDivElement): Renderer | null;
    }
    interface Element {
      size(width: number, height: number): void;
      hide(): void;
      elt: HTMLVideoElement;
    }
  }
}

/* APP TYPES */
interface TestUploadType {
  participant_id: string;
  url: string;
  photo_url: string;
  start_time: string;
  end_time: string;
  submitted: string;
  barcode_string: string;
  internet_connection: string;
  app_version: string;
  os_version: string;
  phone_model: string;
  device_name: string;
  device_storage: string;
  look_away_time: string;
  hand_out_of_frame: string;
  drugkitname: string;
  tracking_number: string;
  shippinglabelURL: string;
  scan_barcode_kit_value: string;
  detect_kit_value: string;
  signature_screenshot: string;
  proof_id: string;
  face_compare_url: string;
  face_scan1_url: string;
  face_scan2_url: string;
  face_scan3_url: string;
  face_scan1_percentage: string;
  face_scan2_percentagstring: string;
  face_scan3_percentage: string;
  image_capture1_url: string;
  image_capture2_url: string;
  passport_photo_url: string;
  government_photo_url: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
}
