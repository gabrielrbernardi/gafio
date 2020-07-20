import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MedicineService } from "./MedicinesService";

const Medicine = () => {
   const [medicine, setMedicine] = useState([]);
   const medicineService = new MedicineService();
   const rows = 10;

   useEffect(() => {
      medicineService.getMedicineService().then((data) => {
         setMedicine(data);
      });
   }, []);

   const header = <p className="d-inline">Tabela de medicamentos</p>;

   return (
      <>
         <div>
            <DataTable
               value={medicine}
               style={{ margin: 48 }}
               header={header}
               paginator={true}
               rows={rows}
            >
               <Column
                  field="EAN"
                  header="Código"
                  style={{ width: "8%", textAlign: "center" }}
               />
               <Column
                  field="PrincipioAtivo"
                  header="Principio Ativo"
                  style={{ width: "20%", textAlign: "center" }}
               />
               <Column
                  field="CNPJ"
                  header="CNPJ"
                  style={{ width: "20%", textAlign: "center" }}
               />
               <Column
                  field="Laboratorio"
                  header="Laboratório"
                  style={{ width: "20%", textAlign: "center" }}
               />
               <Column
                  field="Registro"
                  header="Registro"
                  style={{ width: "20%", textAlign: "center" }}
               />
               <Column
                  field="Produto"
                  header="Produto"
                  style={{ width: "20%", textAlign: "center" }}
               />
               <Column
                  field="Apresentacao"
                  header="Apresentaçao"
                  style={{ width: "20%", textAlign: "center" }}
               />
               <Column
                  field="ClasseTerapeutica"
                  header="Classe Terapêutica"
                  style={{ width: "20%", textAlign: "center" }}
               />
            </DataTable>
         </div>
      </>
   );
};

export default Medicine;
