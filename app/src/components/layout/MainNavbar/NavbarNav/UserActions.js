import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import {
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Collapse,
	NavItem,
	NavLink
} from "shards-react";

import { logoutUser, useAuthState, useAuthDispatch } from "../../../../context";
import { Api } from "../../../../data";

function UserActions() {
    let history = useHistory();
	const dispatch = useAuthDispatch();
	const { user } = useAuthState();
	
	const [ visible, toggleVisible ] = useState(false);
	const [ username, changeUsername ] = useState('');

	if (!username) {
		Api.GetCurrentUser()
			.then(response => {
				if (response.data.data) {
					changeUsername(response.data.data.name);
				}
			})
			.catch(err => { })
	}

	return (
		<NavItem tag={Dropdown} caret toggle={(ev) => toggleVisible(!visible)}>
			<DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
				<img
					className="user-avatar rounded-circle mr-2"
					src="/images/blizzard/inv_misc_questionmark.jpg"
					alt="Avatar"
				/>{" "}
				<span className="d-none d-md-inline-block">{username}</span>
			</DropdownToggle>
			<Collapse tag={DropdownMenu} right small open={visible}>
				<DropdownItem tag={Link} to="user-profile">
					<i className="material-icons">&#xE7FD;</i> Profile
				</DropdownItem>
				<DropdownItem tag={Link} to="edit-user-profile">
					<i className="material-icons">&#xE8B8;</i> Edit Profile
				</DropdownItem>
				<DropdownItem divider />
				<DropdownItem tag={Link} onClick={(ev) => { ev.preventDefault(); logoutUser(dispatch); history.push('/')}} to="/" className="text-danger">
					<i className="material-icons text-danger">&#xE879;</i> Logout
				</DropdownItem>
			</Collapse>
		</NavItem>
	);
}

export default UserActions;
/*
export default class UserActionsOld extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			visible: false
		};
		
		this.toggleUserActions = this.toggleUserActions.bind(this);
	}

	logoutUser(ev) {
		ev.preventDefault();
	
		
	}
	
	toggleUserActions() {
		this.setState({
			visible: !this.state.visible
		});
	}
	
	render() {
		return (
			<NavItem tag={Dropdown} caret toggle={this.toggleUserActions}>
				<DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
				<img
					className="user-avatar rounded-circle mr-2"
					src="/images/blizzard/inv_misc_questionmark.jpg"
					alt="Avatar"
				/>{" "}
				<span className="d-none d-md-inline-block">Sierra Brooks</span>
				</DropdownToggle>
				<Collapse tag={DropdownMenu} right small open={this.state.visible}>
					<DropdownItem tag={Link} to="user-profile">
						<i className="material-icons">&#xE7FD;</i> Profile
					</DropdownItem>
					<DropdownItem tag={Link} to="edit-user-profile">
						<i className="material-icons">&#xE8B8;</i> Edit Profile
					</DropdownItem>
					<DropdownItem divider />
					<DropdownItem tag={Link} onClick={(ev) => this.logoutUser} to="/" className="text-danger">
						<i className="material-icons text-danger">&#xE879;</i> Logout
					</DropdownItem>
				</Collapse>
			</NavItem>
		);
	}
}
	
*/