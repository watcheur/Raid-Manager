import React from "react";
import PropTypes from "prop-types";
import { Container, Button } from "shards-react";

class Error extends React.Component {
	default = {
		error: 500,
		title: 'Something went wrong!',
		message: 'There was a problem on our end. Please try again later.',
		back: '/'
	}
	
	constructor(props) {
		super(props);
	}

	render() {
		const { error, title, message, back } = this.props;

		return(
			<Container fluid className="main-content-container px-4 pb-4">
				<div className="error">
					<div className="error__content">
						<h2>{error}</h2>
						<h3>{title}</h3>
						<p>{message}</p>
						<Button href={back} pill>&larr; Go Back</Button>
					</div>
				</div>
			</Container>
		)
	}
}

Error.propTypes = {
	/**
	 * Error's number
	 */
	error: PropTypes.number,
	/**
	 * Error's title
	 */
	title: PropTypes.string,
	/**
	 * Error's message
	 */
	message: PropTypes.string,
	/**
	 * 'Go Back' button link, default /
	 */
	back: PropTypes.string
};

Error.defaultProps = {
	error: 500,
	title: 'Something went wrong!',
	message: 'There was a problem on our end. Please try again later.',
	back: '/'
};

export default Error;
