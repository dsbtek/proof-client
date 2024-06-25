"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  FunctionComponent,
} from "react";
import * as faceapi from "face-api.js";

// Define context props interface
interface ModelContextProps {
  modelsLoaded: boolean;
}

// Create context with initial undefined value
const ModelContext = createContext<ModelContextProps | undefined>(undefined);

// Custom hook to use the ModelContext
const useModelContext = () => {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error("useModelContext must be used within a ModelProvider");
  }
  return context;
};

// Define props interface for ModelProvider
interface ModelProviderProps {
  children: ReactNode;
}

const ModelProvider = ({ children }: ModelProviderProps) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading models: ", error);
      }
    };
    loadModels();
  }, []);

  return (
    <ModelContext.Provider value={modelsLoaded}>
      {modelsLoaded ? children : <div>Loading models...</div>}
    </ModelContext.Provider>
  );
};

export { ModelProvider, useModelContext };
