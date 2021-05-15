import React, { useState } 	from 'react';
import { LOGIN } 			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';
import {Link, useHistory} from 'react-router-dom';

const Login = (props) => {
	const [input, setInput] = useState({ email: '', password: '' });
	const [loading, toggleLoading] = useState(false);
	const [showErr, displayErrorMsg] = useState(false);
	const errorMsg = "Email/Password not found.";
	const [Login] = useMutation(LOGIN);

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	}

	const history = useHistory();

	const handleLogin = async (e) => {

		const { loading, error, data } = await Login({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (data.login._id === null) {
			displayErrorMsg(true);
			return;
		}
		if (data) {
			console.log(data);
			props.fetchUser();
			// props.refetchTodos();
			toggleLoading(false)
			history.push('/');
		};
	};


	return (
        // Replace div with WModal

		<div className="login-modal">
			<div className="modal-header" onClose={() => props.setShowLogin(false)}>
				Login
				<Link to='/'>
					<WButton className="login-close" onClick={null}>
					<i className="material-icons">close</i>
					</WButton>
				</Link>
			</div>

			{
				loading ? <div />
					: <div className="main-login-modal">

						<WInput className="modal-input" onBlur={updateInput} name='email' labelAnimation="up" barAnimation="solid" labelText="Email Address" wType="outlined" inputType='text' />
						<div className="modal-spacer">&nbsp;</div>
						<WInput className="modal-input" onBlur={updateInput} name='password' labelAnimation="up" barAnimation="solid" labelText="Password" wType="outlined" inputType='password' />

						{
							showErr ? <div className='modal-error'>
								{errorMsg}
							</div>
								: <div className='modal-error'>&nbsp;</div>
						}

					</div>
			}
			<div>
			<WRow className="modal-col-gap">
				<WCol size="6">
					<Link to='/'>
						<WButton className="modal-button" onClick={null} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
							Cancel
						</WButton>
					</Link>
				</WCol>
				<WCol size="6">
					<Link to='/'>
						<WButton className="modal-button" onClick={handleLogin} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
							Login
						</WButton>
					</Link>
				</WCol>
			</WRow>
			</div>
		</div>
	);
}

export default Login;