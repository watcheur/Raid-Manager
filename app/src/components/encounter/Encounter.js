import React from "react";
import PropTypes from "prop-types";
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  FormFeedback,
  FormSelect,
  Button,
  Card,
  CardHeader,
  CardBody,
  DatePicker,
  InputGroup,
  Collapse,
  CardFooter
} from "shards-react";
import { toast } from 'react-toastify';
import moment from "moment";

import Api from '../../data/api';

class Encounter extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            collapsed: false
        }
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({ collapsed: !this.state.collapsed })
    }

    render()
    {
        const { encounter } = this.props;

        return (
            <div>
                <ListGroupItem className='border-top border-bottom border-0 rounded-0'>
                    <h6 className="m-0" onClick={this.toggle}>{encounter.name} <i className='material-icons'>{this.state.collapsed ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i></h6>
                    <Collapse open={this.state.collapsed}>
                        <div className="p-3">
                            <span>
                                In sagittis nibh non arcu viverra, nec imperdiet quam suscipit.
                                Sed porta eleifend scelerisque. Vestibulum dapibus quis arcu a
                                facilisis.
                            </span>
                        </div>
                    </Collapse>
                </ListGroupItem>
            </div>
        )
    }
}

export default Encounter;