import styles from "./Timer.module.css";

interface IIdTimer {
    timeLeft: number;
}

const IdTimer = ({ timeLeft }: IIdTimer) => {
    // Format time to "mm:ss"
    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = String(time % 60).padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    // Hide the timer if timeLeft is 0
    if (timeLeft <= 0) {
        return null;
    }

    return (
        <div className={styles.baseTimer}>
            <span className="id-loader">{formatTime(timeLeft)}</span>
        </div>
    );
};

export default IdTimer;
