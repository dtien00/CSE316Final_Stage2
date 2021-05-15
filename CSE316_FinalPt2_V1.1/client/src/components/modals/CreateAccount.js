import React, { useState } 	from 'react';
import { REGISTER }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';
import {Link} from 'react-router-dom';

const CreateAccount = (props) => {
	const [input, setInput] = useState({ email: '', password: '', name: '' });
	const [loading, toggleLoading] = useState(false);
	const [Register] = useMutation(REGISTER);

	
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
		console.log(updated);
	};

	const handleCreateAccount = async (e) => {
		console.log("creating account");
		for (let field in input) {
			if (!input[field]) {
				alert('All fields must be filled out to register');
				return;
			}
		}
		console.log(input);
		const { loading, error, data } = await Register({ variables: { ...input } });
		console.log("Registered: " + { variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			console.log(data)
			toggleLoading(false);
			if(data.register.email === 'already exists') {
				alert('User with that email already registered');
			}
			else {
				props.fetchUser();
			}

		};
	};

	return (
        // Replace div with WModal

		<div className="signup-modal" wind>
			<div className="modal-header" onClose={() => props.setShowCreate(false)}>
				Sign Up
				<Link to='/'>
					<WButton className="sign-up-close" onClick={null}>
					<i className="material-icons">close</i>
					</WButton>
				</Link>
			</div>

			<div className="modal-spacer">&nbsp;</div>
			{
				loading ? <div />
					: <div>
								<WInput 
									className="modal-input" onBlur={updateInput} name="name" labelAnimation="up" 
									barAnimation="solid" labelText="Name" wType="outlined" inputType="text" 
								/>
							{/* <WCol size="6">
								<WInput 
									className="" onBlur={updateInput} name="lastName" labelAnimation="up" 
									barAnimation="solid" labelText="Last Name" wType="outlined" inputType="text" 
								/>
							</WCol> */}

						<div className="modal-spacer">&nbsp;</div>
						<WInput 
							className="modal-input" onBlur={updateInput} name="email" labelAnimation="up" 
							barAnimation="solid" labelText="Email Address" wType="outlined" inputType="text" 
							
						/>
						<div className="modal-spacer">&nbsp;</div>
						<WInput 
							className="modal-input" onBlur={updateInput} name="password" labelAnimation="up" 
							barAnimation="solid" labelText="Password" wType="outlined" inputType="password" 
						/>
					</div>
			}
			<div className="modal-spacer">&nbsp;</div>
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
					<WButton className="modal-button" onClick={handleCreateAccount} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
						Submit
					</WButton>
				</Link>
			</WCol>
			</WRow>
			
		</div>
	);
}

export default CreateAccount;
