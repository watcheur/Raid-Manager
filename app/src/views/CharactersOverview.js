import React from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import GameData from "../data/gamedata";
import CharactersList from "../components/characters/CharacterList";
import CharacterAdd from "../components/characters/CharacterAdd";
import Stats from "../components/characters/Stats";

const CharactersOverview = () => (
  <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle title="Characters" subtitle="Dashboard" className="text-sm-left mb-3" />
    </Row>

    <Stats />

    <Row className="justify-content-md-center">
      <Col md="6">
        <CharacterAdd parameters={{ category: 'French' }} realm='ysondre' />
      </Col>
    </Row>

    <Row>
      <Col>
        <CharactersList title="Mains" type={GameData.Characters.Type.MAIN} />
      </Col>
    </Row>
    
    <Row>
      <Col>
        <CharactersList title="Alts" type={GameData.Characters.Type.ALT} />
      </Col>
    </Row>
    
    <Row>
      <Col>
        <CharactersList title="Alts fun" type={GameData.Characters.Type.ALT_FUN}/>
      </Col>
    </Row>
  </Container>
);

export default CharactersOverview;
