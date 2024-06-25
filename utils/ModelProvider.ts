import React, {
  useContext,
  useEffect,
  useState,
  ReactNode,
  FunctionComponent,
} from "react";
import { ModelContext } from "./modelContext"; // Adjust the path as necessary
import * as faceapi from "face-api.js";

interface ModelContextProps {
  modelsLoaded: boolean;
}

interface ModelProviderProps {
  children: ReactNode;
}

const ModelProvider: FunctionComponent<ModelProviderProps> = ({ children }) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  return (
    <ModelContext.Provider value={{ modelsLoaded }}>
      {children}
    </ModelContext.Provider>
  );
};

export default ModelProvider;
