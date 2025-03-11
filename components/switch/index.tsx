'use client';

import './switch.css';

interface IMobileSwitchProps {
    onToggleGridView: () => void;
    onToggleListView: () => void;
    switchGridView: boolean;
    switchListView: boolean;
}

const Switch = ({
    onToggleGridView,
    onToggleListView,
    switchGridView,
    switchListView,
}: IMobileSwitchProps) => {
    return (
        <>
            <div className="view-switch-wrap_">
                <button
                    className={`btn-grid-list-view ${
                        switchGridView ? 'grid-active' : ''
                    }`}
                    onClick={onToggleGridView}
                >
                    Grid View
                </button>
                <button
                    className={`btn-grid-list-view ${
                        switchListView ? 'grid-active' : ''
                    }`}
                    onClick={onToggleListView}
                >
                    List View
                </button>
            </div>
        </>
    );
};

export default Switch;
