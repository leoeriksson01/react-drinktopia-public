import React from 'react'
import Container from 'react-bootstrap/Container'
import {Link} from "react-router-dom"

const PageNotFound = () => {
	return (
		<Container className="searchContainer">
			<h1>Denna sidan finns inte. Återvänd till <Link to="/"> startsidan </Link></h1>
		</Container>
	)
}

export default PageNotFound