import React from 'react';
import { io } from "socket.io-client";

const SOCKET_URL = "http://18.189.13.6:5000";

export const socket = io(SOCKET_URL);
export const SocketContext = React.createContext();