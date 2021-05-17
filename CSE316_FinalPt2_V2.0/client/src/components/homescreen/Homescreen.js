import React, { useState, useEffect } 	from 'react';
import Globe							from '../../transparent_globe_altered.png'

const Homescreen = (props) => {
	return (
		<>
			<h1 className="welcome-prompt">
					Welcome to the World Data Mapper
			</h1>
			<img className="welcome-icon" src={Globe} alt="welcome image"/>
		</>
	);
};

export default Homescreen;