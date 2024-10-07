import { useState, useEffect } from "react";
import * as ml5 from "ml5";
import { toast } from "react-toastify";

const useHandPose = () => {
    const [handPose, setHandPose] = useState<any>(null); // Using `any` type for simplicity

    useEffect(() => {
        const loadHandPose = async () => {
            try {
                const model = await ml5.handpose();
                setHandPose(model);
            } catch (error) {
                console.error("Error loading hand pose model:", error);
                toast.error("Error loading hand pose model.");
            }
        };

        loadHandPose();
    }, []);

    return handPose;
};

export default useHandPose;
