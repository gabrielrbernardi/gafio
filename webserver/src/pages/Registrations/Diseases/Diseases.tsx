import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DiseasesService } from './DiseasesService';

const Diseases = () => {
  const [disease, setDisease] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);

  const diseasesService = new DiseasesService();
  const rows = 10;

  function getDiseasesFunction(data?: any){
    setLoading(true);
    if (!data) {
      diseasesService.getDiseasesPaginate(10).then(data => {
        setDisease(data.slice(0, rows));
        setLoading(false);

        return
      });
    }
    else {
      setDisease(data.slice(0, rows));
      setLoading(false);
    }
  }

  useEffect(() => {
    diseasesService.getDiseasesPaginate(10).then(data => {
      setTotalRecords(data.length);
      getDiseasesFunction(data.diseases);
    });
  }, []);

  const onPage = (event: any) => {
    setLoading(true);
    setTimeout(() => {
      const startIndex = event.first;
      const endIndex = event.first + rows;
      diseasesService.getDiseasesPaginate(endIndex).then(data => {
        getDiseasesFunction(data.diseases);
      });      
      setFirst(startIndex);      
      setLoading(false);
    });
  }

  const header = <p className="d-inline">Listagem de doenças</p>;

  return (
    <>
      <div>
        <DataTable value={disease} style={{ margin: 48 }} paginator={true} rows={rows} header={header} totalRecords={totalRecords} 
            emptyMessage="Nenhum resultado encontrado" responsive={true} resizableColumns={true} loading={loading} 
            first={first} onPage={onPage} lazy={true}>
            <Column field="CodDoenca" header="Código" style={{width:'8%', textAlign:'center'}}/>
            <Column field="Nome" header="Nome" style={{width:'20%', textAlign:'center'}}/>
        </DataTable>
      </div>
    </>
  )
}

export default Diseases;