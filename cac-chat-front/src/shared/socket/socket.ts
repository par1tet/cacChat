import { io } from "socket.io-client";
import { serverLink } from "../api/serverLink";

export const socket = io(serverLink('').slice(0,-1))