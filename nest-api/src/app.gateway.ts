import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;
	
	emit(channel: string, payload: any) {
		this.server.emit(channel, payload);
	}
	
	afterInit(server: Server) {

	}
	
	handleDisconnect(client: Socket) {

	}
	
	handleConnection(client: Socket, ...args: any[]) {

	}
}