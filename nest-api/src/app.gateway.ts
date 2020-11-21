import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	MessageBody,
	WsResponse,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum SocketChannel {
	Character = "CHARACTER",
	Event = "EVENT",
	Composition = "COMPOSITION",
	Note = "NOTE",
	Option = "OPTION",
	Player = "PLAYER"
}

export enum SocketAction
{
	Created = 'CREATE',
	Updated = 'UPDATE',
	Deleted = 'DELETE',
}

export interface ISocketData
{
	action: SocketAction,
	data: any
}

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	readonly logger = new Logger(AppGateway.name);

	@WebSocketServer()
	server: Server;
	
	emit(teamId: number, channel: SocketChannel, payload: ISocketData) {
		this.logger.debug(`Send to room [${teamId}] using channel [${channel}] : ${payload.action}`)
		this.server.in(""+teamId).emit(channel, payload);
	}
	
	afterInit(server: Server) {
		this.logger.log("Websocket Gateway started")
		this.server.setMaxListeners(20);
	}
	
	handleDisconnect(client: Socket) {
		
	}
	
	handleConnection(client: Socket, ...args: any[]) {
		
	}

	@SubscribeMessage('team')
	handleEvent(
		@MessageBody() data: any,
		@ConnectedSocket() client: Socket,
	): string {
		if (data.team)
			client.join(data.team); // We're using teamId as room

		return data;
	}
}