import React, { useState, useEffect } from 'react';
import { DiseasesService } from './DiseasesService';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

import Button from 'react-bootstrap/Button';

import { FiSearch } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';

const Diseases = () => {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);

  const diseasesService = new DiseasesService();
  const rows = 10;

  const [searchInput, setSearchInput] = useState('');
  const [optionState, setOptionState] = useState<any>(null);
  const [mode, setMode] = useState('N');
  const [toast, setToast] = useState<boolean>();
  const [messageType, setMessageType] = useState<string>('');
  const [messageTitle, setMessageTitle] = useState<string>('');
  const [messageContent, setMessageContent] = useState<string>('');
  const [datasource, setDatasource] = useState([]);

  function getDiseasesFunction(data?: any){
    setLoading(true);
    setDiseases([]);

    if (!data) {
      diseasesService.getDiseasesPaginate(10).then(data => {
        console.log(data);

        setDatasource(data.diseases);
        setDiseases(datasource.slice(0, rows));
        setLoading(false);

        return;
      });
    }
    else {
      console.log(data);

      setDatasource(data.diseases);
      setDiseases(data.diseases.slice(0, rows));
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

  function handleSearch() {
    if (!optionState) {
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
    diseasesService.searchDiseasesGlobal(searchInput, optionState.cod, first+rows).then(data => {
      if (!data.filteredDisease) {
        setLoading(false);
        return;
      }
      getDiseasesFunction(data);
    });
  }

  function showToast(messageType: string, messageTitle: string, messageContent: string) {
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
                    size={50} 
                    onChange={
                      (e) => setSearchInput((e.target as HTMLInputElement).value)
                    } 
                    onKeyPress={
                      (e) => {
                        if (e.key === 'Enter') { 
                          handleSearch(); 
                          e.preventDefault(); 
                        }
                      }
                    } 
                  />
                  {
                    optionState === null
                    ? <label htmlFor="float-input">Buscar</label>
                    : <label htmlFor="float-input">Buscar por { optionState.name }</label>
                  }
                </span>
                <Dropdown 
                  className="mx-1" 
                  value={optionState} 
                  options={[
                    { name: 'Código', cod: 'C' },
                    { name: 'Nome', cod: 'N' },
                  ]} 
                  onChange={(e: { value: any }) => { setOptionState(e.value) }}
                  placeholder="Selecione um filtro" 
                  optionLabel="name" 
                  style={{width: '12em'}}
                />
                <Button 
                  tabIndex={2} 
                  variant="outline-danger" 
                  className="p-0 mr-1" 
                  style={{width: '17px'}} 
                  onClick={() => { 
                    setSearchInput(''); 
                    getDiseasesFunction(); 
                    setMode('N'); 
                    setOptionState(null)}
                  }
                >
                  <AiOutlineClose size={15}/>
                </Button>
                <Button onClick={handleSearch}>
                  <FiSearch size={20}/>
                </Button>
              </div>
              <Button variant="success" onClick={diseasesService.updateDiseasesDB}>Atualizar banco de dados</Button>
            </div>
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      <DataTable 
        value={diseases} 
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
        lazy={true}
      >
        <Column field="CodDoenca" header="Código" style={{width: '8%', textAlign: 'center'}}/>
        <Column field="Nome" header="Nome" style={{width: '20%', textAlign: 'center'}}/>
      </DataTable>
    </>
  )
}

export default Diseases;