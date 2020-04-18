import React from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import Blizzard from "../data/blizzard";
import CharactersList from "../components/characters/characters-list";
import CharacterAdd from "../components/characters/character-add";
import Stat from "../components/characters/stats";

const CharactersOverview = () => (
  <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle title="Characters" subtitle="Dashboard" className="text-sm-left mb-3" />
    </Row>

    <Stat />

    <Row>
      <Col>
        <CharacterAdd parameters={{ category: 'French' }} realm='ysondre' />
      </Col>
    </Row>

    <Row>
      <Col>
        <CharactersList title="Mains" parameters={ { type: Blizzard.Characters.Type.MAIN } } />
      </Col>
    </Row>
    
    <Row>
      <Col>
        <CharactersList title="Alts" parameters={ { type: Blizzard.Characters.Type.ALT } } />
      </Col>
    </Row>
    
    <Row>
      <Col>
        <CharactersList title="Alts fun" parameters={ { type: Blizzard.Characters.Type.ALT_FUN } } />
      </Col>
    </Row>
  </Container>
);

export default CharactersOverview;
