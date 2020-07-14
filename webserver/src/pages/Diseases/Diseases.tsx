import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DiseasesService } from './DiseasesService';

const Diseases = () => {
  const [disease, setDisease] = useState([]);
  const [loading, setLoading] = useState(true);

  const diseasesService = new DiseasesService();
  const rows = 10;

  useEffect(() => { 
    document.title = 'GAFio | Doenças';
    diseasesService.getDiseasesService().then(data => {
      setDisease(data);
      setLoading(false);
    });
  }, [diseasesService]);

  const header = <p className="d-inline">Listagem de doenças</p>;

  return (
    <>
      <div>
        <DataTable value={disease} style={{margin: 48}} header={header} paginator={true} rows={rows} loading={loading}>
          {/* <Column field="CodDoenca" header="Código" style={{width:'8%', textAlign:'center'}}/>
          <Column field="Nome" header="Nome" style={{width:'20%', textAlign:'center'}} /> */}
          <Column field="codigo" header="Código" style={{width:'8%', textAlign:'center'}} filter={true} filterPlaceholder="Buscar por código CID"/>
          <Column field="nome" header="Nome" style={{width:'20%', textAlign:'center'}} filter={true} filterPlaceholder="Buscar por nome"/>
        </DataTable>
      </div>
    </>
  )
}

export default Diseases;