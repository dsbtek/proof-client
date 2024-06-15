import { ToastContainer } from "react-toastify";

const Toastify = () => {
    return (
        <ToastContainer position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={true}
            limit={1}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            closeOnClick
            theme='light'
            style={{ zIndex: '10001' }}
        />
    )
};

export default Toastify;