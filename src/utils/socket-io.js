import { io } from "socket.io-client";

//Connect server backend
const socket = io(process.env.REACT_APP_BACKEND_API);

//Export default socket io
export default socket;
