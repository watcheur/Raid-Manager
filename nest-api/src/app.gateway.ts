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

export enum SocketChannels {
	Item = "ITEM",
	Character = "CHARACTER",
	Event = "EVENT",
	Composition = "COMPOSITION",
	Note = "NOTE",
	Option = "OPTION",
	Player = "PLAYER"
}

export enum ISocketAction
{
	Created = 'CREATE',
	Updated = 'UPDATE',
	Deleted = 'DELETE',
}

export interface ISocketData
{
	action: ISocketAction,
	data: any
}

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	readonly logger = new Logger(AppGateway.name);

	@WebSocketServer() server: Server;
	
	emit(channel: SocketChannels, payload: any) {
		this.server.emit(channel, payload);
	}
	
	afterInit(server: Server) {
		this.logger.log("Websocket Gateway started")
	}
	
	handleDisconnect(client: Socket) {

	}
	
	handleConnection(client: Socket, ...args: any[]) {

	}
}