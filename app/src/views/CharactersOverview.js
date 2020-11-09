import React from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import GameData from "../data/gamedata";
import CharactersList from "../components/characters/CharacterList";
import CharacterAdd from "../components/characters/CharacterAdd";
import Stats from "../components/characters/Stats";

const CharactersOverview = (props) => (
  <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle title="Characters" subtitle="Dashboard" className="text-sm-left mb-3" />
    </Row>

  {/*
    <Stats {...props}/>

    {props.admin && (
    <Row className="justify-content-md-center">
      <Col sm="12" md="12" lg="9">
        <CharacterAdd parameters={{ category: 'French' }} realm='ysondre' {...props} />
      </Col>
    </Row>)}

    <Row>
      <Col>
        <CharactersList title="Mains" type={GameData.Characters.Type.MAIN} {...props} />
      </Col>
    </Row>
    
    <Row>
      <Col>
        <CharactersList title="Alts" type={GameData.Characters.Type.ALT} {...props} />
      </Col>
    </Row>
    
    <Row>
      <Col>
        <CharactersList title="Alts fun" type={GameData.Characters.Type.ALT_FUN} {...props} />
      </Col>
    </Row>
    */}
  </Container>
);

export default CharactersOverview;
