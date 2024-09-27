import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface BACTest {
    alcoholLevel: number | null;
    connectionError: string;
    connected: boolean;
    isConnecting: boolean;
}

const initialState: BACTest = {
    alcoholLevel: null,
    connectionError: '',
    connected: false,
    isConnecting: false
};

// Async thunk for connecting to the Bluetooth device
export const connectToBreathalyzer = createAsyncThunk(
    "app/connect",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const parseCharacteristicvalue = (value: any) => {
                const is16Bits = value.getUint8(0) && 0x1;
                if (is16Bits) return value.getUint16(1, true);
                return value.getUnit8(1);
            }

            const handleCharacteristicValueChanged = (event: Event) => {
                console.log(`Breathalyzer checking alcohol content...`);
                const characteristic = event.target as BluetoothRemoteGATTCharacteristic;
                const value = characteristic.value;

                if (value) {
                    const alcoholLevel = parseCharacteristicvalue(value);
                    console.log(`Breathalyzer Data: ${alcoholLevel}`);

                    dispatch(updateAlcoholLevel(alcoholLevel));
                }
            };

            const onDisconnected = (event: Event) => {
                const device = event.target as any;
                console.log(`Device ${device?.name} is disconnected.`);
                dispatch(setConnected(false))
            }

            const device = await (navigator as any)?.bluetooth.requestDevice({
                filters: [{ services: ['0000fff0-0000-1000-8000-00805f9b34fb'] }]
                // filters: [{ name: 'SmartBreathalyzer' }],
                // optionalServices: ['battery_service']
            });

            device.addEventListener('gattserverdisconnected', onDisconnected);

            const server = await device.gatt.connect();
            dispatch(setIsConnecting(true));
            const service = await server.getPrimaryService('0000fff0-0000-1000-8000-00805f9b34fb');
            const characteristic = await service.getCharacteristic('0000ffff-0000-1000-8000-00805f9b34fb');
            // const service = await server.getPrimaryService('battery_service');
            // const characteristic = await service.getCharacteristic('battery_level');



            // Listen for characteristic value changes (notifications)
            characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
            await characteristic.startNotifications();

            console.log('Notifications have been started.');
            console.table(service);
            console.table(characteristic);
            // return characteristic;
        } catch (error: any) {
            console.error('BAC Device Connect Error:', error)
            return rejectWithValue(error.message);
        }
    }
);

// Slice to manage the state of the breathalyzer connection
const BACSlice = createSlice({
    name: "BACTest",
    initialState,
    reducers: {
        updateAlcoholLevel: (state, action: PayloadAction<number>) => {
            state.alcoholLevel = action.payload;
        },
        setConnected: (state, action: PayloadAction<boolean>) => {
            state.connected = action.payload;
        },
        setIsConnecting: (state, action: PayloadAction<boolean>) => {
            state.isConnecting = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(connectToBreathalyzer.fulfilled, (state, action) => {
                state.connected = true;
                state.isConnecting = false
            })
            .addCase(connectToBreathalyzer.rejected, (state, action) => {
                state.connectionError = action.payload as string;
                state.connected = false;
                state.isConnecting = false
            });
    },
});

export const { updateAlcoholLevel, setConnected, setIsConnecting } = BACSlice.actions;

export const bacTestData = (state: { bacTest: BACTest }) => state.bacTest;

export default BACSlice.reducer;