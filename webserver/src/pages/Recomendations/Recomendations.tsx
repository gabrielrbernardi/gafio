import React, { useState } from 'react';

// import PDFFile from '../../static/ProvaTeoricaLogica.pdf';

const Recomendations = () => {    
    return (
        <>
            <div className="card shadow-lg mb-4 mx-auto p-2 col-sm-8 offset-md-3">
                <p>ESTE É UM ARQUIVO DE EXEMPLO</p>
                <embed src="http://mozilla.github.io/pdf.js/web/viewer.html" width="100%" height="500vh" type="application/pdf"></embed>
            </div>
        </>
    )
}

export default Recomendations;