import React                                from 'react';
import Logo 							from '../navbar/Logo';
import { LOGOUT }                           from '../../cache/mutations';
import { useMutation, useApolloClient }     from '@apollo/client';
import { WButton, WNavItem }                from 'wt-frontend';
import { WNavbar, WSidebar } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { isTypeSystemDefinitionNode } from 'graphql';
import {Link} from 'react-router-dom';

const LoggedIn = (props) => {
    const client = useApolloClient();
	const [Logout] = useMutation(LOGOUT);

    const handleLogout = async (e) => {
        Logout();
        const { data } = await props.fetchUser();
        if (data) {
            let reset = await client.resetStore();
            // if (reset) props.setActiveList({});
        }
    };

    return (
        <>
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
                            
                            <Link to='/'>
                                <Logo className='logo' 
                                    user={props.user}
                                />
                            </Link>
						</WNavItem>
					</ul>
					<ul>
                                    
                        <WNavItem hoverAnimation="lighten">
                            <Link to='/update'>
                                <WButton className="navbar-options" onClick={props.setShowUpdate} wType="texted" hoverAnimation="text-primary"> 
                                    {props.user==undefined? "undefined":props.user.name}
                                </WButton>
                            </Link>
                        </WNavItem>
                        <WNavItem hoverAnimation="lighten">
                            <Link to='/'>
                                <WButton className="navbar-options" onClick={handleLogout} wType="texted" hoverAnimation="text-primary">
                                    Logout
                                </WButton>
                            </Link>
                        </WNavItem >
					</ul>
				</WNavbar>
			</WLHeader>
        </>
    );
};

const LoggedOut = (props) => {
    return (
        <>
            <WLHeader>
				<WNavbar color="colored">
                <ul>
						<WNavItem>
                            
                            <Link to='/'>
                                <Logo className='logo' 
                                />
                            </Link>
						</WNavItem>
				</ul>
                <ul>
                <WNavItem hoverAnimation="lighten">
                    <Link to='/register'>
                        <WButton className="navbar-options" onClick={props.setShowCreate} wType="texted" hoverAnimation="text-primary"> 
                            Create Account
                        </WButton>
                    </Link>
                </WNavItem>
                <WNavItem hoverAnimation="lighten">
                    <Link to='/login'>
                        <WButton className="navbar-options" onClick={props.setShowLogin} wType="texted" hoverAnimation="text-primary">
                            Login
                        </WButton>
                    </Link>
                </WNavItem>
				</ul>
                </WNavbar>
            </WLHeader>
        </>
    );
};


const NavbarOptions = (props) => {
    return (
        <>
            {
                props.auth === false ? <LoggedOut setShowLogin={props.setShowLogin} setShowCreate={props.setShowCreate} setHomeScreen={props.setHomeScreen}/>
                : <LoggedIn fetchUser={props.fetchUser} setActiveList={props.setActiveList} logout={props.logout} setShowUpdate={props.setShowUpdate} 
                    user={props.user}/>
            }
        </>

    );
};

export default NavbarOptions;