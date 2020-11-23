import React from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import GameData from "../data/gamedata";
import CharactersList from "../components/characters/CharacterList";
import CharacterAdd from "../components/characters/CharacterAdd";
import Stats from "../components/characters/Stats";


import { useAuthState, useAuthDispatch } from "../context";

const CharactersOverview = (props) => {
	const { user, team } = useAuthState();

	return (
		<Container fluid className="main-content-container px-4">

			{/* Page Header */}
			<Row noGutters className="page-header py-4">
				<PageTitle title="Characters" subtitle="Dashboard" className="text-sm-left mb-3" />
			</Row>

			{user && (
				<Row className="justify-content-md-center">
					<Col sm="12" md="12" lg="9">
						<CharacterAdd parameters={{ category: 'French' }} realm={1335} team={team}  user={user} {...props} />
					</Col>
				</Row>
			)}
			
			<Row>
				<Col>
					<CharactersList title="Mains" type={GameData.Characters.Type.MAIN} team={team} user={user} {...props} />
				</Col>
			</Row>
			
			<Row>
				<Col>
					<CharactersList title="Alts" type={GameData.Characters.Type.ALT} team={team} user={user} {...props} />
				</Col>
			</Row>
			
			<Row>
				<Col>
					<CharactersList title="Alts fun" type={GameData.Characters.Type.ALT_FUN} team={team} user={user} {...props} />
				</Col>
			</Row>
		</Container>
	);
}
		
export default CharactersOverview;
		