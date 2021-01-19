import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import Button from 'react-bootstrap/Button';
import { FiSearch } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';

const History = () => {
    const myToast: any = useRef(null);

    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        {
            label: 'Entrada',
            command: (event: any) => {
                showToast('info', 'Data de entrada', event.item.label)
            }
        },
        {
            label: 'Avaliações',
            command: (event: any) => {
                showToast('info', 'Data da avaliação', event.item.label)
            }
        },
        {
            label: 'Verificação',
            command: (event: any) => {
                showToast('info', 'Status verificação', event.item.label)
            }
        },
        {
            label: 'Desfecho',
            command: (event: any) => {
                showToast('info', 'Desfecho', event.item.label)
            }
        }
    ];

    const [optionState, setOptionState] = useState<any>(null);

    function showToast(severity: String, summary: String, detail: String) {
        myToast.current.show({ severity: severity, summary: summary, detail: detail, life: 6000 });
    }

    return (
        <>
            <Toast ref={myToast} position="bottom-left"></Toast>
            <div className="card row mx-4 p-4">
                <h5 className="py-1">Histórico do paciente</h5>

                <div className="p-inputgroup py-1">
                    <InputText 
                        placeholder="Pesquisar por paciente"
                        className="mr-2"
                        style={{ maxWidth: '20vw' }}
                    />
                    <Dropdown
                        optionLabel="name"
                        placeholder="Selecione um filtro"
                        className="mr-2"
                        style={{ maxWidth: '14vw' }}
                        options={[
                            { name: 'Nome do paciente', cod: 'No' },
                            { name: 'Número do paciente', cod: 'Nu' },
                        ]}
                        value={optionState}
                        onChange={(e: { value: any }) => { setOptionState(e.value) }}
                    />
                    <Button 
                        className="d-inline-flex justify-content-center align-items-center mr-2"
                        variant="outline-danger"
                    >
                        <AiOutlineClose size={18} />
                    </Button>
                    <Button className="d-inline-flex justify-content-center align-items-center">
                        <FiSearch size={18} />
                    </Button>
                </div>

                <Steps 
                    className="pt-4 pb-2" 
                    model={items} 
                    activeIndex={activeIndex} 
                    onSelect={(e) => setActiveIndex(e.index)} 
                    readOnly={false} 
                />
            </div>
        </>
    );
}

export default History;