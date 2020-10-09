import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MedicineService } from "./MedicinesService";
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const Medicine = () => {
   const [medicine, setMedicine] = useState([]);
   const medicineService = new MedicineService();
   const rows = 10;

   useEffect(() => {
      medicineService.getMedicineService().then((data) => setMedicine(data));
   }, []);

   const header = <p className="d-inline">Tabela de medicamentos</p>;

   return (
      <>
         <div className="row m-5 px-5">
            
            <Link to={location => ({...location, pathname: '/registrations/medicines/create'})}>
               <Button variant="outline-dark" className="mb-2" style={{borderRadius: '0', height:'41.5px'}}>Cadastrar Medicamento</Button>
            </Link>

            <DataTable value={medicine} header={header} paginator={true} rows={rows} className="p-datatable-responsive-demo" resizableColumns={true}>
               <Column field="EAN" header="Código" style={{ width: "8%", textAlign: "center" }}/>
               <Column field="PrincipioAtivo" header="Principio Ativo" style={{ width: "12%", textAlign: "center" }}/>
               <Column field="CNPJ" header="CNPJ" style={{ width: "10%", textAlign: "center" }}/>
               <Column field="Laboratorio" header="Laboratório" style={{ width: "20%", textAlign: "center" }}/>
               <Column field="Registro" header="Registro" style={{ width: "6%", textAlign: "center" }}/>
               <Column field="Produto" header="Produto" style={{ width: "8%", textAlign: "center" }}/>
               <Column field="Apresentacao" header="Apresentação" style={{ width: "15%", textAlign: "center" }}/>
               <Column field="ClasseTerapeutica" header="Classe Terapêutica" style={{ width: "20%", textAlign: "center" }}/>
            </DataTable>
         </div>
      </>
   );
};

export default Medicine;
