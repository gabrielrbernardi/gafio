import React, { useState, useEffect } from 'react';
import { DiseasesService } from './DiseasesService';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

import Button from 'react-bootstrap/Button';

import { FiCheck, FiSearch } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';

const Diseases = () => {
  const [disease, setDisease] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);

  const diseasesService = new DiseasesService();
  const rows = 10;

  const [searchInput, setSearchInput] = useState('');
  const [getOptionState, setOptionState] = useState<any>(null)
  const [getMode, setMode] = useState('N');
  const [getToast, setToast] = useState<boolean>();
  const [getMessageType, setMessageType] = useState<string>('');
  const [getMessageTitle, setMessageTitle] = useState<string>('');
  const [getMessageContent, setMessageContent] = useState<string>('');
  const [datasource, setDatasource] = useState([]);


  function getDiseasesFunction(data?: any){
    setLoading(true);
    setDisease([]);
    if (!data) {
      diseasesService.getDiseasesPaginate(10).then(data => {
        console.log(data)
        console.log(1)
        setDatasource(data.diseases);
        setDisease(datasource.slice(0, rows));
        setLoading(false);

        return;
      });
    }
    else {
      console.log(data)
      setDatasource(data.diseases);
      setDisease(data.diseases.slice(0, rows));
      setLoading(false);
    }
  }

  useEffect(() => {
    diseasesService.getDiseasesPaginate(10).then(data => {
      setTotalRecords(data.length);
      getDiseasesFunction(data);
    });
  }, []);

  const onPage = (event: any) => {
    setLoading(true);
    setTimeout( () => {
      const startIndex = event.first;
      const endIndex = event.first + rows;
    
      diseasesService.getDiseasesPaginate(endIndex).then(data => {
        getDiseasesFunction(data.diseases);
      });      
      setFirst(startIndex);      
      setLoading(false);
    });
  }

  function handleSearch() {
    if (!getOptionState){
      showToast('error', 'Erro!', 'Selecione um filtro para buscar.');
      return;
    }
    setLoading(true);
    if (!searchInput) {
      diseasesService.getDiseasesPaginate(10).then(data => {
        getDiseasesFunction(data);
        setLoading(false);
        showToast('error', 'Erro!', 'Digite algum valor para pesquisar.');
      });
      return;
    } 
    setMode('S');
    diseasesService.searchDiseaseGlobal(searchInput, getOptionState.cod, first+rows).then(data => {
      if(!data.filteredDisease){
        setLoading(false);
        return;
      }
      getDiseasesFunction(data);
    });
  }

  function showToast(messageType: string, messageTitle: string, messageContent: string){
    setToast(false);
    setMessageType(messageType);
    setMessageTitle(messageTitle);
    setMessageContent(messageContent);
    setToast(true);
    setTimeout(() => { setToast(false) }, 4500);
  }

  const header = (
    <>
      <p style={{textAlign: 'left'}} className="p-clearfix d-inline">Tabela de doenças</p>
      <div className="row">
        <div className="col-sm-4">
          <span className="p-float-label p-inputgroup">
            <div className="p-col-12">
              <div className="p-inputgroup mt-4 mb-1">
                <span className="p-float-label">
                  <InputText 
                    id="float-input" 
                    type="search" 
                    value={searchInput} 
                    onChange={
                      (e) => { setSearchInput((e.target as HTMLInputElement).value) }
                    } 
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') { handleSearch(); e.preventDefault(); }}
                    } 
                    size={50} 
                  />
                  {
                    getOptionState === null
                    ? <label htmlFor="float-input">Buscar</label>
                    : <label htmlFor="float-input">Buscar por { getOptionState.name }</label>
                  }
                </span>
                <Dropdown 
                  className="mx-1" 
                  value={getOptionState} 
                  options={[
                    { name: 'CodDoenca', cod: 'C' },
                    { name: 'Nome', cod: 'N' },
                  ]} 
                  onChange={(e: { value: any }) => { setOptionState(e.value) }}
                  placeholder="Selecione um filtro" 
                  optionLabel="name" 
                  style={{width: '12em'}}
                />
                <Button tabIndex={2} variant="outline-danger" className="p-0 mr-1" style={{width: '17px'}} onClick={ () => { setSearchInput(''); getDiseasesFunction(); setMode('N'); setOptionState(null)}}><AiOutlineClose size={15}/></Button>
                <Button onClick={handleSearch}><FiSearch size={20}/></Button>
              </div>
            </div>
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div>
        <DataTable 
          value={disease} 
          style={{ margin: 48 }} 
          paginator={true} 
          rows={rows} 
          header={header} 
          totalRecords={totalRecords} 
          emptyMessage="Nenhum resultado encontrado" 
          className="p-datatable-responsive-demo" 
          resizableColumns={true} 
          loading={loading} 
          first={first} 
          onPage={onPage} 
          lazy={true}>
          <Column field="CodDoenca" header="Código" style={{width: '8%', textAlign: 'center'}}/>
          <Column field="Nome" header="Nome" style={{width: '20%', textAlign: 'center'}}/>
        </DataTable>
      </div>
    </>
  )
}

export default Diseases;