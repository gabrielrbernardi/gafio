import React, { useRef, useState } from 'react';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';

const History = () => {

    const myStep: any = useRef(null);
    const myToast: any = useRef(null);

    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        {
            label: 'Entrada',
            command: (event:any) => {
                showToast('info', 'Data', event.item.label)
            }
        },
        {
            label: 'Avaliações',
            command: (event:any) => {
                showToast('info', 'Data', event.item.label)
            }
        },
        {
            label: 'Verificação',
            command: (event:any) => {
                showToast('info', 'Verificação correta?', event.item.label)
            }
        },
        {
            label: 'Desfecho',
            command: (event:any) => {
                showToast('info', 'Desfecho', event.item.label)
            }
        }
    ];

    function showToast(severity: String, summary: String, detail: String) {
        myToast.current.show({severity: severity, summary: summary, detail: detail, life: 6000});
    }

    return (
        <>
            <Toast ref={myToast} position="bottom-left"></Toast>  
            <div className="card row mx-5 pt-2 pl-2">
                <h5>Histórico do paciente</h5>
                <Steps className="py-2 px-3" model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
            </div>
        </>
    );
}

export default History;