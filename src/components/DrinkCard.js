
import React from 'react'
 import { useNavigate } from "react-router-dom";
 

const DrinkCard = ({ drink }) => {
	const navigate = useNavigate();

	
	return (
		<div className="drinkContainer" onClick={() => navigate(`/drink/${drink.docId}`)}>
			<div className="imagePictureContainer"> 
				<img src={drink.image_src} alt={drink.name} width="100%" height="100%" />
				</div>
				<h3> {drink.name}</h3>
		</div>
		
	)
}

export default DrinkCard
