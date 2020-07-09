import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DiseasesService } from './DiseasesService';

const Diseases = () => {
  const [disease, setDisease] = useState([]);
  const diseasesService = new DiseasesService();
  const rows = 10;

  useEffect(() => { 
    diseasesService.getDiseasesService().then(data => {
      setDisease(data);
    });
  }, []);

  const header = <p className="d-inline">Tabela de doenças</p>;

  return (
    <>
      <div>
        <DataTable value={disease} style={{margin: 48}} header={header} paginator={true} rows={rows}>
          <Column field="CodDoenca" header="Código" style={{width:'8%', textAlign:'center'}} />
          <Column field="Nome" header="Nome" style={{width:'20%', textAlign:'center'}} />
        </DataTable>
      </div>
    </>
  )
}

export default Diseases;