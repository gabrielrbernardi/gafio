import React from 'react';
import {useHistory} from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';

const Header = () => {
    const history = useHistory();
    
    function handleBackButton(){
        history.goBack();
    }

    return(
        <div>
            <button className="btn" onClick={handleBackButton}>
                <FiArrowLeft size={20} />
            </button>
        </div>
    )
}

export default Header;